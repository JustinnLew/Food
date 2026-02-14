use axum::{Router, routing::get};
use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use tracing::{Level, info};

#[derive(Clone)]
struct AppState {
    db: Pool<Postgres>,
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
    let state = AppState {
        db: pool,
    };
    info!("Connected to Database...");

    let app = Router::new()
    .route("/api/test", get(|| async { "Hello World"}))
    .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:6000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
    info!("Server started on port 6000...");
}
