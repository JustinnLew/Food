use reqwest::StatusCode;
use uuid::Uuid;

use crate::embedding::EmbeddingService;

use super::repo::RecipeRepository;
use super::{CreateRecipe, RecipeQueryResultRow};

use sqlx::types::{BigDecimal, JsonValue};

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

        let embedding_text = EmbeddingService::build_recipe_text(&payload.title, &payload.description, &payload.tags);

        tx.commit()
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(recipe_id)
    }

    pub async fn query_recipe_strict(
        &self,
        ingredients: JsonValue,
        difficulty: i16,
        cook_time_mins: i64,
    ) -> Result<Vec<RecipeQueryResultRow>, StatusCode> {
        self.repo
            .query_recipes(ingredients, difficulty, cook_time_mins, 1.into())
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }

    pub async fn query_recipe_relaxed(
        &self,
        ingredients: JsonValue,
        difficulty: i16,
        cook_time_mins: i64,
    ) -> Result<Vec<RecipeQueryResultRow>, StatusCode> {
        self.repo
            .query_recipes(
                ingredients,
                difficulty,
                cook_time_mins,
                BigDecimal::new(5.into(), 1),
            )
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }

    pub async fn query_recipe_random(
        &self,
        ingredients: JsonValue,
    ) -> Result<Vec<RecipeQueryResultRow>, StatusCode> {
        self.repo
            .query_recipes_random(ingredients)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }
}
