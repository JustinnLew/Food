use serde::Deserialize;
use sqlx::types::JsonValue;

#[derive(Debug, Deserialize)]
pub struct RecipeIngredient {
    pub id: i64,
    pub amount: f32,
    pub unit: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateRecipe {
    pub title: String,
    pub difficulty: i16,
    pub cook_time_minutes: i64,
    pub instructions: JsonValue,
    pub ingredients: Vec<RecipeIngredient>,
}
