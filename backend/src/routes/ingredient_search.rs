use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};

use crate::{AppState, models::ingredients::{Ingredient, IngredientSearchQuery}};

pub async fn search_ingredients(
    State(state): State<Arc<AppState>>,
    Query(params): Query<IngredientSearchQuery>,
) -> Result<Json<Vec<Ingredient>>, StatusCode> {

    let results = state.ingredient_service
        .search(params.q)
        .await
        .map_err(|e| {
            tracing::error!("Search failed: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(results))
}
