use pgvector::Vector;
use serde_json::json;
use sqlx::types::JsonValue;
use sqlx::{PgPool, Postgres, Transaction, types::BigDecimal};
use uuid::Uuid;

use super::{CreateRecipe, RecipeIngredient, RecipeQueryResultRow};
use num_traits::cast::ToPrimitive;

#[derive(Clone)]
pub struct RecipeRepository {
    pub pool: PgPool,
}

impl RecipeRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn insert_recipe_embedding(
        pool: &PgPool,
        recipe_id: i64,
        embedding: Vec<f32>,
    ) -> Result<(), sqlx::Error> {
        let embedding = Vector::from(embedding);
        sqlx::query(
            r#"UPDATE recipes SET embedding = $2 WHERE id = $1"#,
        )
        .bind(recipe_id)
        .bind(embedding)
        .execute(pool)
        .await?;
        Ok(())
    }

    pub async fn insert_recipe_details(
        tx: &mut Transaction<'_, Postgres>,
        user_id: Uuid,
        payload: &CreateRecipe,
    ) -> Result<i64, sqlx::Error> {
        let row = sqlx::query!(
            r#"INSERT INTO public.recipes (author, title, difficulty, cook_time_mins, instructions, description, tags)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id"#,
            user_id,
            payload.title,
            payload.difficulty,
            payload.cook_time_minutes,
            payload.instructions,
            payload.description,
            &payload.tags
        )
        .fetch_one(&mut **tx)
        .await?;

        Ok(row.id)
    }

    pub async fn insert_recipe_ingredients(
        tx: &mut Transaction<'_, Postgres>,
        recipe_id: i64,
        ing: &RecipeIngredient,
    ) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, amount, unit)
               VALUES ($1, $2, $3, $4)"#,
            recipe_id,
            ing.id,
            ing.amount,
            ing.unit
        )
        .execute(&mut **tx)
        .await?;

        Ok(())
    }

    pub async fn query_recipes(
        &self,
        ingredients: JsonValue,
        difficulty: i16,
        cook_time_mins: i64,
        threshold: BigDecimal,
    ) -> Result<Vec<RecipeQueryResultRow>, sqlx::Error> {
        let recipes = sqlx::query!(
            r#"
            WITH
            candidate_recipes AS (
                SELECT * FROM recipes r
                WHERE r.difficulty <= $2 AND r.cook_time_mins <= $3
            ),
            user_ingredients AS (
                SELECT
                (elem->>'id')::integer AS ingredient_id,
                (elem->>'amount')::float * iu.conversion AS user_amount,
                iu.unit
                FROM jsonb_array_elements($1::jsonb) AS elem
                JOIN ingredient_units iu ON iu.unit = elem->>'unit'
            ),
            recipe_ingredients_converted AS (
                SELECT
                ri.ingredient_id, ri.recipe_id,
                ri.amount * iu.conversion AS required_amount,
                cr.title, i.name, ri.unit
                FROM recipe_ingredients ri
                JOIN ingredient_units iu ON ri.unit = iu.unit
                JOIN candidate_recipes cr ON ri.recipe_id = cr.id
                JOIN ingredients i ON ri.ingredient_id = i.id
            ),
            ingredient_matching AS (
                SELECT
                rig.recipe_id, rig.ingredient_id, rig.required_amount,
                rig.name, rig.unit AS recipe_unit, ui.unit AS user_unit, ui.user_amount,
                CASE
                    WHEN ui.ingredient_id IS NULL THEN 'missing'
                    WHEN (ui.unit = 'unit' AND rig.unit != 'unit')
                    OR (ui.unit != 'unit' AND rig.unit = 'unit') THEN 'missing'
                    WHEN ui.user_amount < rig.required_amount THEN 'insufficient'
                    ELSE 'matched'
                END AS match_status
                FROM recipe_ingredients_converted rig
                LEFT JOIN user_ingredients ui ON ui.ingredient_id = rig.ingredient_id
            ),
            recipe_scores AS (
                SELECT
                recipe_id,
                ROUND(
                    COUNT(*) FILTER (WHERE match_status = 'matched')::numeric / COUNT(*)::numeric, 2
                ) AS match_score,
                JSON_AGG(JSON_BUILD_OBJECT('ingredient', name, 'required_amount', required_amount, 'unit', recipe_unit))
                    FILTER (WHERE match_status = 'missing') AS missing_ingredients,
                JSON_AGG(JSON_BUILD_OBJECT('ingredient', name, 'required_amount', required_amount, 'user_amount', user_amount, 'unit', user_unit))
                    FILTER (WHERE match_status = 'insufficient') AS insufficient_ingredients,
                JSON_AGG(JSON_BUILD_OBJECT('name', name, 'amount', required_amount, 'unit', user_unit))
                    FILTER (WHERE match_status = 'matched') AS ingredients
                FROM ingredient_matching
                GROUP BY recipe_id
                HAVING COUNT(*) FILTER (WHERE match_status = 'matched')::numeric / COUNT(*)::numeric >= $4
            )
            SELECT
            r.id, r.title, r.difficulty, r.cook_time_mins, r.instructions, r.image_src,
            rs.match_score, rs.ingredients, rs.missing_ingredients, rs.insufficient_ingredients
            FROM recipes r
            JOIN recipe_scores rs ON rs.recipe_id = r.id
            ORDER BY rs.match_score DESC
            "#,
            ingredients,
            difficulty,
            cook_time_mins,
            threshold
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(recipes
            .into_iter()
            .map(|r| RecipeQueryResultRow {
                id: r.id,
                title: r.title,
                difficulty: r.difficulty,
                cook_time_mins: r.cook_time_mins,
                instructions: r.instructions,
                image_src: r.image_src,
                match_score: r.match_score.unwrap_or_default().to_f64().unwrap_or(0.0),
                ingredients: r.ingredients.unwrap_or(json!([])),
                missing_ingredients: r.missing_ingredients.unwrap_or(json!([])),
                insufficient_ingredients: r.insufficient_ingredients.unwrap_or(json!([])),
            })
            .collect())
    }

    pub async fn query_recipes_random(
        &self,
        ingredients: JsonValue,
    ) -> Result<Vec<RecipeQueryResultRow>, sqlx::Error> {
        let recipes = sqlx::query!(
            r#"
            WITH
            candidate_recipes AS (
                SELECT * FROM recipes r
                ORDER BY RANDOM()
                LIMIT 10
            ),
            user_ingredients AS (
                SELECT
                (elem->>'id')::integer AS ingredient_id,
                (elem->>'amount')::float * iu.conversion AS user_amount,
                iu.unit
                FROM jsonb_array_elements($1::jsonb) AS elem
                JOIN ingredient_units iu ON iu.unit = elem->>'unit'
            ),
            recipe_ingredients_converted AS (
                SELECT
                ri.ingredient_id, ri.recipe_id,
                ri.amount * iu.conversion AS required_amount,
                cr.title, i.name, ri.unit
                FROM recipe_ingredients ri
                JOIN ingredient_units iu ON ri.unit = iu.unit
                JOIN candidate_recipes cr ON ri.recipe_id = cr.id
                JOIN ingredients i ON ri.ingredient_id = i.id
            ),
            ingredient_matching AS (
                SELECT
                rig.recipe_id, rig.ingredient_id, rig.required_amount,
                rig.name, rig.unit AS recipe_unit, ui.unit AS user_unit, ui.user_amount,
                CASE
                    WHEN ui.ingredient_id IS NULL THEN 'missing'
                    WHEN (ui.unit = 'unit' AND rig.unit != 'unit')
                    OR (ui.unit != 'unit' AND rig.unit = 'unit') THEN 'missing'
                    WHEN ui.user_amount < rig.required_amount THEN 'insufficient'
                    ELSE 'matched'
                END AS match_status
                FROM recipe_ingredients_converted rig
                LEFT JOIN user_ingredients ui ON ui.ingredient_id = rig.ingredient_id
            ),
            recipe_scores AS (
                SELECT
                recipe_id,
                ROUND(
                    COUNT(*) FILTER (WHERE match_status = 'matched')::numeric / COUNT(*)::numeric, 2
                ) AS match_score,
                JSON_AGG(JSON_BUILD_OBJECT('ingredient', name, 'required_amount', required_amount, 'unit', recipe_unit))
                    FILTER (WHERE match_status = 'missing') AS missing_ingredients,
                JSON_AGG(JSON_BUILD_OBJECT('ingredient', name, 'required_amount', required_amount, 'user_amount', user_amount, 'unit', user_unit))
                    FILTER (WHERE match_status = 'insufficient') AS insufficient_ingredients,
                JSON_AGG(JSON_BUILD_OBJECT('name', name, 'amount', required_amount, 'unit', user_unit))
                    FILTER (WHERE match_status = 'matched') AS ingredients
                FROM ingredient_matching
                GROUP BY recipe_id
            )
            SELECT
            r.id, r.title, r.difficulty, r.cook_time_mins, r.instructions, r.image_src,
            rs.match_score, rs.ingredients, rs.missing_ingredients, rs.insufficient_ingredients
            FROM recipes r
            JOIN recipe_scores rs ON rs.recipe_id = r.id
            ORDER BY rs.match_score DESC
            "#,
            ingredients,
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(recipes
            .into_iter()
            .map(|r| RecipeQueryResultRow {
                id: r.id,
                title: r.title,
                difficulty: r.difficulty,
                cook_time_mins: r.cook_time_mins,
                instructions: r.instructions,
                image_src: r.image_src,
                match_score: r.match_score.unwrap_or_default().to_f64().unwrap_or(0.0),
                ingredients: r.ingredients.unwrap_or(json!([])),
                missing_ingredients: r.missing_ingredients.unwrap_or(json!([])),
                insufficient_ingredients: r.insufficient_ingredients.unwrap_or(json!([])),
            })
            .collect())
    }
}
