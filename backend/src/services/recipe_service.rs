use reqwest::StatusCode;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{models::recipe::CreateRecipe, repositories::recipe_repo::RecipeRepository};

#[derive(Clone)]
pub struct RecipeService;

impl RecipeService {
    pub async fn create_recipe(
        &self,
        user_id: Uuid,
        payload: CreateRecipe,
        db: PgPool,
    ) -> Result<i64, StatusCode> {
        let mut tx = db
            .begin()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let recipe_id = RecipeRepository::insert_recipe_details(&mut tx, user_id, &payload)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        for ing in &payload.ingredients {
            RecipeRepository::insert_recipe_ingredients(&mut tx, recipe_id, ing)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        }

        tx.commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(recipe_id)
    }
}
