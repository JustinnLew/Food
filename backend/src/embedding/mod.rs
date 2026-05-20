use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct Req { model: String, input: String, dimensions: usize }
#[derive(Deserialize)]
struct Res { embeddings: Vec<Vec<f32>> }

#[derive(Clone)]
pub struct EmbeddingService {
    client: reqwest::Client,
    url: String,
    model: String,
}

impl EmbeddingService {
    pub fn new(url: &str, model: &str) -> Self {
        Self {
            client: reqwest::Client::new(),
            url: url.to_string(),
            model: model.to_string(),
        }
    }

    pub async fn embed(&self, text: &str, dimensions: usize) -> Result<Vec<f32>, reqwest::Error> {
        let res = self.client
            .post(self.url.clone())
            .json(&Req { model: self.model.clone(), input: text.to_string(), dimensions: dimensions})
            .send()
            .await?
            .json::<Res>()
            .await?;

        Ok(res.embeddings.into_iter().next().unwrap_or_default())
    }

    pub fn build_recipe_text(title: &str, description: &str, tags: &[String]) -> String {
        format!("Recipe: {}. {}. Tags: {}", title, description, tags.join(", "))
    }
}