use serde_json::json;
use sqlx::{PgPool, Postgres, Transaction, query};
use uuid::Uuid;

use crate::models::recipe::{CreateRecipe, RecipeIngredient, RecipeRandomQueryResultRow};

#[derive(Clone)]
pub struct RecipeRepository {
    pub pool: PgPool,
}

impl RecipeRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn insert_recipe_details(
        tx: &mut Transaction<'_, Postgres>,
        user_id: Uuid,
        payload: &CreateRecipe,
    ) -> Result<i64, sqlx::Error> {
        let row = sqlx::query!(
            r#"INSERT INTO public.recipes (author, title, difficulty, cook_time_mins, instructions)
               VALUES ($1, $2, $3, $4, $5) RETURNING id"#,
            user_id,
            payload.title,
            payload.difficulty,
            payload.cook_time_minutes,
            payload.instructions
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

    pub async fn query_recipes_strict() {}

    pub async fn query_recipes_relaxed() {}

    pub async fn query_recipes_random(
        &self,
    ) -> Result<Vec<RecipeRandomQueryResultRow>, sqlx::Error> {
        let recipes = query!(
            r#"
            SELECT
                r.id,
                r.title,
                r.difficulty,
                r.cook_time_mins,
                r.instructions,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'name', i.name,
                        'amount', ri.amount,
                        'unit', ri.unit
                    )
                ) AS ingredients
            FROM recipes r
            JOIN recipe_ingredients ri ON ri.recipe_id = r.id
            JOIN ingredients i ON i.id = ri.ingredient_id
            GROUP BY r.id, r.title, r.difficulty, r.cook_time_mins, r.instructions
            ORDER BY RANDOM()
            LIMIT 10;
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(recipes
            .into_iter()
            .map(|r| RecipeRandomQueryResultRow {
                id: r.id,
                title: r.title,
                difficulty: r.difficulty,
                cook_time_mins: r.cook_time_mins,
                instructions: r.instructions,
                ingredients: r.ingredients.unwrap_or(json!([])),
            })
            .collect())
    }
}
