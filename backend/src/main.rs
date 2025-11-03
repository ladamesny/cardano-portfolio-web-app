use axum::Router;
use sea_orm::{Database, DatabaseConnection};
use tower_http::{trace::TraceLayer, cors::{CorsLayer, Any}};
use crate::services::cardano::CardanoService;
use std::sync::Arc;

mod routes;
mod handlers;
mod entities;
mod services;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let db = Database::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Setup cardano service
    let cardano_service_api_key = std::env::var("BLOCKFROST_API_KEY")
        .expect("BLOCKFROST_API_KEY must be set");
    let cardano_service_base_url = std::env::var("CARDANO_SERVICE_URL")
        .expect("CARDANO_SERVICE_URL must be set");
    let cardano_service = Arc::new(CardanoService::new(cardano_service_api_key, cardano_service_base_url));

    let app_state = AppState::new(
        db,
        cardano_service,
    );


    tracing_subscriber::fmt::init();


    let app = routes::create_router(app_state)
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any)
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000")
        .await
        .unwrap();

    println!("Server running on http://localhost:8000");

    axum::serve(listener, app).await.unwrap();
}

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub cardano_service: Arc<CardanoService>,
}

impl AppState {
    pub fn new(db: DatabaseConnection, cardano_service: Arc<CardanoService>) -> Self {
        Self { db, cardano_service }
    }
}
