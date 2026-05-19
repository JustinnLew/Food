use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};

use crate::{
    AppState,
    ingredient::{Ingredient, IngredientSearchQuery},
};

pub async fn search_ingredients(
    State(state): State<Arc<AppState>>,
    Query(params): Query<IngredientSearchQuery>,
) -> Result<Json<Vec<Ingredient>>, StatusCode> {
    let results = state.ingredient_service.search(params.q).await?;

    Ok(Json(results))
}
