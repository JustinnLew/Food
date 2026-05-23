use std::sync::Arc;

use axum::{Extension, Json, extract::State, response::IntoResponse};
use reqwest::StatusCode;
use sqlx::types::Uuid;
use tracing::warn;

use crate::{
    AppState, embedding::EmbeddingService, middlewares::auth::Claims, recipe::CreateRecipe,
};

pub async fn create_recipe(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateRecipe>,
) -> Result<impl IntoResponse, StatusCode> {
    println!("{:?}", payload);

    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::BAD_REQUEST)?;

    let recipe_id = state
        .recipe_service
        .create_recipe(user_id, &payload)
        .await
        .map_err(|e| {
            warn!("Failed to create recipe: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let embedding_text =
        EmbeddingService::build_recipe_text(&payload.title, &payload.description, &payload.tags);
    let sc = state.clone();
    tokio::spawn(async move {
        if let Ok(embedding) = sc.embedding_service.embed(&embedding_text, 512).await {
            if let Err(e) = sc
                .recipe_service
                .store_embedding(recipe_id, embedding)
                .await
            {
                warn!(
                    "Failed to store embedding for recipe {}: {:?}",
                    recipe_id, e
                );
            }
        } else {
            warn!("Failed to generate embedding for recipe {}", recipe_id);
        }
    });

    Ok((StatusCode::CREATED, Json(recipe_id)))
}
