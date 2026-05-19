use reqwest::StatusCode;

use super::Ingredient;
use super::repo::IngredientRepository;

#[derive(Clone)]
pub struct IngredientService {
    repo: IngredientRepository,
}

impl IngredientService {
    pub fn new(repo: IngredientRepository) -> Self {
        Self { repo }
    }

    pub async fn search(&self, query: String) -> Result<Vec<Ingredient>, StatusCode> {
        self.repo
            .search_by_name(&query)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
    }
}
