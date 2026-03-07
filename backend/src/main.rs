use std::sync::Arc;

use axum::{Router, middleware, routing::{get, post}};
use jsonwebtoken::jwk::JwkSet;
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use tower_http::cors::CorsLayer;
use tracing::{Level, info};

use crate::{middlewares::auth::auth_guard};
use search::ingredient_search::search_ingredients;
use routes::create_recipe::create_recipe;

mod middlewares;
mod search;
mod routes;

#[derive(Clone)]
struct AppState {
    db: Pool<Postgres>,
    jwks: JwkSet,
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt()
        .with_target(false)
        .with_max_level(Level::INFO)
        .init();
    info!("Starting server...");

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    let jwks =
        reqwest::get(format!("https://{}.supabase.co/auth/v1/.well-known/jwks.json", std::env::var("PROJECT_REF").expect("PROJECT_REF must be set")))
            .await
            .expect("Failed to fetch JWKS")
            .json()
            .await
            .expect("Failed to parse JWKS");
    let state = Arc::new(AppState {
        db: pool,
        jwks: jwks,
    });
    info!("Connected to Database...");

    let protected_routes = Router::new()
        .route("/api/ingredients", get(search_ingredients))
        .route("/api/create-recipe", post(create_recipe))
        .layer(middleware::from_fn_with_state(state.clone(), auth_guard));

    let app = Router::new()
        .route("/api/health", get(|| StatusCode::Ok))
        .merge(protected_routes)
        .layer(CorsLayer::very_permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
    info!("Server started on port 3000...");
}

