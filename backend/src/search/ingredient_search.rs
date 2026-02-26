use std::sync::Arc;

use axum::{Json, extract::{Query, State}, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, query_as};

use crate::AppState;

#[derive(Deserialize, Debug)]
pub struct IngredientSearchQuery {
    pub q: String,
}

#[derive(Serialize, FromRow, Debug)]
pub struct Ingredient {
    pub id: i64,
    pub name: String,
}

pub async fn search_ingredients(
    State(state): State<Arc<AppState>>,
    Query(params): Query<IngredientSearchQuery>
) -> Result<Json<Vec<Ingredient>>, StatusCode> {
    let pattern = format!("%{}%", params.q.trim());

    let results = query_as!(
        Ingredient,
        "SELECT id, name FROM public.ingredients
         WHERE name ILIKE $1
         ORDER BY name ASC
         LIMIT 10",
        pattern
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("Database error: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(results))
}