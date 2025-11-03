use axum::{routing::{get, post}, Router};
use sea_orm::DatabaseConnection;

use crate::handlers::{users, wallets};
use crate::AppState;

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/users", post(users::create_user))
        .route("/wallets", post(wallets::create_wallet))
        .route("/wallets/{id}", get(wallets::get_wallet_data))
        .route("/wallets/stake/{stake_key}", get(wallets::get_wallet_by_stake_key))
        .with_state(state)
}

