use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Deserialize, Debug)]
pub struct IngredientSearchQuery {
    pub q: String,
}

#[derive(Serialize, FromRow, Debug)]
pub struct Ingredient {
    pub id: i64,
    pub name: String,
    pub supported_units: Vec<String>,
    pub default_unit: String,
}
