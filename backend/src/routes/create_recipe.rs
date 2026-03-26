use std::sync::Arc;

use axum::{Extension, Json, extract::State, response::IntoResponse};
use reqwest::StatusCode;
use sqlx::types::Uuid;

use crate::{AppState, middlewares::auth::Claims, models::recipe::CreateRecipe};

pub async fn create_recipe(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateRecipe>,
) -> Result<impl IntoResponse, StatusCode> {
    println!("{:?}", payload);

    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::BAD_REQUEST)?;

    let recipe_id = state
        .recipe_service
        .create_recipe(user_id, payload)
        .await
        .map_err(|e| {
            eprintln!("Failed to create recipe: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok((StatusCode::CREATED, Json(recipe_id)))
}
