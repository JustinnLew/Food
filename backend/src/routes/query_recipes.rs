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
            return state
                .recipe_service
                .query_recipe_random()
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);
        }
        RecipeQueryMode::Relaxed => {
            return state
                .recipe_service
                .query_recipe_random()
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);
        }
        RecipeQueryMode::Random => {
            return state
                .recipe_service
                .query_recipe_random()
                .await
                .map(Json)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
}
