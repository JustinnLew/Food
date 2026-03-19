use std::sync::Arc;

use axum::{Extension, Json, extract::State, response::IntoResponse};
use reqwest::StatusCode;
use serde::Deserialize;
use sqlx::{query, types::{JsonValue, Uuid}};

use crate::{AppState, middlewares::auth::Claims};

#[derive(Debug, Deserialize)]
pub struct RecipeIngredient {
    id: i64,
    amount: f32,
    unit: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateRecipe {
    title: String,
    difficulty: i16,
    cook_time_minutes: i64,
    instructions: JsonValue,
    ingredients: Vec<RecipeIngredient>
}

pub async fn create_recipe(
    State(state): State<Arc<AppState>>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateRecipe>) -> Result<impl IntoResponse, StatusCode> {
    println!("{:?}", payload);

    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::BAD_REQUEST)?;
    let mut tx = state.db.begin().await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Insert main recipe
    let recipe_row = query!(
        r#"
        INSERT INTO public.recipes (author, title, difficulty, cook_time_mins, instructions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        "#,
        user_id,
        payload.title,
        payload.difficulty,
        payload.cook_time_minutes,
        payload.instructions
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        eprintln!("Database Error: {:?}", e);
        StatusCode::BAD_REQUEST
    })?;

    // Insert ingredients
    for ing in payload.ingredients {
        query!(
            r#"INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, amount, unit)
            VALUES ($1, $2, $3, $4)"#,
            recipe_row.id,
            ing.id,
            ing.amount,
            ing.unit
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| {
            eprintln!("Ingredient Insert Error: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;
    }

    tx.commit().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(recipe_row.id)))
}