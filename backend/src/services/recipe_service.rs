use reqwest::StatusCode;
use uuid::Uuid;

use crate::{models::recipe::{CreateRecipe, RecipeRandomQueryResultRow}, repositories::recipe_repo::RecipeRepository};

#[derive(Clone)]
pub struct RecipeService {
    pub repo: RecipeRepository,
}

impl RecipeService {
    pub fn new(repo: RecipeRepository) -> Self {
        Self { repo }
    }

    pub async fn create_recipe(
        &self,
        user_id: Uuid,
        payload: CreateRecipe,
    ) -> Result<i64, StatusCode> {
        // Could consider a refactor to move this into the repository layer?
        let mut tx = self
            .repo
            .pool
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

    pub async fn query_recipe_strict(&self) {}

    pub async fn query_recipe_relaxed(&self) {}

    pub async fn query_recipe_random(&self) -> Result<Vec<RecipeRandomQueryResultRow>, StatusCode> {
        self.repo.query_recipes_random().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }
}
