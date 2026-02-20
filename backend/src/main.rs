use std::sync::Arc;

use axum::{Router, middleware, routing::get};
use jsonwebtoken::jwk::{JwkSet};
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use tracing::{Level, info};

use crate::middlewares::auth::auth_guard;

mod middlewares;

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

    let jwks = reqwest::get("https://yqcaszfogwfzlbbzhlrz.supabase.co/auth/v1/.well-known/jwks.json")
    .await.expect("Failed to fetch JWKS").json().await.expect("Failed to parse JWKS");
    let state = Arc::new(AppState {
        db: pool,
        jwks: jwks
    });
    info!("Connected to Database...");

    let app = Router::new()
    .route("/api/test", get(|| async { "Hello World"}))
    .route("/api/protected", get(|| async {"Protected Route"}).layer(
        middleware::from_fn_with_state(state.clone(), auth_guard)
    ))
    .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:6000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
    info!("Server started on port 6000...");
}