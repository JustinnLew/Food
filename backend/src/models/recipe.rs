use serde::{Deserialize, Serialize};
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
#[derive(Debug, Deserialize)]
pub struct RecipeInstruction {
    pub step: i32,
    pub text: String,
    pub timer: i32,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct RecipeRandomQueryResultRow {
    pub id: i64,
    pub title: String,
    pub difficulty: i16,
    pub cook_time_mins: i64,
    pub instructions: JsonValue,
    pub ingredients: JsonValue,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum RecipeQueryMode {
    Strict,
    Relaxed,
    Random,
}

#[derive(Deserialize, Debug)]
pub struct RecipeQueryIngredient {
    pub id: i64,
    pub amount: f64,
    pub unit: String,
}

#[derive(Deserialize, Debug)]
pub struct RecipeQueryBody {
    pub mode: RecipeQueryMode,
    pub page: i32,
    pub ingredients: Vec<RecipeQueryIngredient>,
    pub time: i32,
    pub difficulty: i32,
}
