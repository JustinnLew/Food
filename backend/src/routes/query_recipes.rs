use std::sync::Arc;

use axum::{Json, extract::State, response::IntoResponse};
use reqwest::StatusCode;

use crate::{
    AppState,
    models::recipe::{RecipeQueryBody, RecipeQueryMode},
};

pub async fn query_recipes(
    State(state): State<Arc<AppState>>,
    // Extension(claims): Extension<Claims>,
    Json(payload): Json<RecipeQueryBody>,
) -> Result<impl IntoResponse, StatusCode> {
    println!("{:?}", payload);
    match payload.mode {
        RecipeQueryMode::Strict => {
            let ingredients = serde_json::to_value(&payload.ingredients)
                .map_err(|_| StatusCode::BAD_REQUEST)?;
            state.recipe_service
                .query_recipe_strict(ingredients, payload.difficulty, payload.time)
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
        }
        RecipeQueryMode::Relaxed => {
            let ingredients = serde_json::to_value(&payload.ingredients)
                .map_err(|_| StatusCode::BAD_REQUEST)?;
            state.recipe_service
                .query_recipe_relaxed(ingredients, payload.difficulty, payload.time)
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
        }
        RecipeQueryMode::Random => {
            let ingredients = serde_json::to_value(&payload.ingredients)
                .map_err(|_| StatusCode::BAD_REQUEST)?;
            state
                .recipe_service
                .query_recipe_random(ingredients)
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
