use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;

pub mod repo;
pub mod service;

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

#[derive(Debug, Serialize)]
pub struct RecipeQueryResultRow {
    pub id: i64,
    pub title: String,
    pub difficulty: i16,
    pub cook_time_mins: i64,
    pub instructions: JsonValue,
    pub image_src: Option<String>,
    pub match_score: f64,
    pub ingredients: JsonValue,
    pub missing_ingredients: JsonValue,
    pub insufficient_ingredients: JsonValue,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum RecipeQueryMode {
    Strict,
    Relaxed,
    Random,
}

#[derive(Deserialize, Debug, Serialize)]
pub struct RecipeQueryIngredient {
    pub id: i64,
    pub amount: f64,
    pub unit: String,
}

#[derive(Deserialize, Debug)]
pub struct RecipeQueryBody {
    pub mode: RecipeQueryMode,
    // pub page: i32,
    pub ingredients: Vec<RecipeQueryIngredient>,
    pub time: i64,
    pub difficulty: i16,
}
