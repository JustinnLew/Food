use crate::{IngredientRepository, models::ingredients::Ingredient};

#[derive(Clone)]
pub struct IngredientService {
    repo: IngredientRepository,
}

impl IngredientService {
    pub fn new(repo: IngredientRepository) -> Self {
        Self { repo }
    }

    pub async fn search(&self, query: String) -> Result<Vec<Ingredient>, sqlx::Error> {
        self.repo.search_by_name(&query).await
    }
}