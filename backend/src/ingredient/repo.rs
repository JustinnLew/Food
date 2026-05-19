use sqlx::PgPool;

use super::Ingredient;

#[derive(Clone)]
pub struct IngredientRepository {
    pool: PgPool,
}

impl IngredientRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn search_by_name(&self, name_query: &str) -> Result<Vec<Ingredient>, sqlx::Error> {
        let pattern = format!("%{}%", name_query.trim());

        sqlx::query_as!(
            Ingredient,
            r#"SELECT id, name, supported_units, default_unit
               FROM public.ingredients
               WHERE name ILIKE $1
               ORDER BY name ASC
               LIMIT 10"#,
            pattern
        )
        .fetch_all(&self.pool)
        .await
    }
}
