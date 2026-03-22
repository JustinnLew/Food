use sqlx::{Postgres, Transaction};
use uuid::Uuid;

use crate::models::recipe::{CreateRecipe, RecipeIngredient};

#[derive(Clone)]
pub struct RecipeRepository;

impl RecipeRepository {
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
}
