use axum::{extract::State, Json, http::StatusCode};
use sea_orm::{ActiveModelTrait, Set, EntityTrait};
use serde::{Deserialize, Serialize};
use crate::entities::{wallet, prelude::*};
use crate::AppState;

#[derive(Deserialize)]
pub struct CreateWalletRequest {
    pub user_id: i32,
    pub stake_key: String,
    pub wallet_type: Option<String>,
}

#[derive(Serialize)]
pub struct WalletDataResponse {
    pub id: i32,
    pub stake_key: String,
    pub active: bool,
    pub balance: String,
    pub rewards: String,
    pub wallet_type: Option<String>,
}

pub async fn create_wallet(
    State(state): State<AppState>,
    Json(payload): Json<CreateWalletRequest>,
) -> Result<Json<WalletDataResponse>, StatusCode> {
    let new_wallet = wallet::ActiveModel {
        user_id: Set(payload.user_id),
        stake_key: Set(payload.stake_key.clone()),
        wallet_type: Set(payload.wallet_type.expect("Wallet type should be present")),
        ..Default::default()
    };

    let wallet = new_wallet.insert(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(WalletDataResponse {
        id: wallet.id,
        stake_key: wallet.stake_key,
        wallet_type: Some(wallet.wallet_type),
        active: false,
        balance: "0".to_string(),
        rewards: "0".to_string(),
    }))
}

pub async fn get_wallet_data(
    State(state): State<AppState>,
    axum::extract::Path(wallet_id): axum::extract::Path<i32>,
) -> Result<Json<WalletDataResponse>, StatusCode> {
    let wallet = Wallet::find_by_id(wallet_id)
        .one(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    eprintln!("STAKE KEY FOR CARDANO SERVICE: {}", &wallet.stake_key);

    let account_info = state.cardano_service
        .get_account_info(&wallet.stake_key)
        .await
        .map_err(|e| {
            eprintln!("Blockfrost error: {:?}", e);
            StatusCode::BAD_GATEWAY
        })?;

    Ok(Json(WalletDataResponse {
        id: wallet.id,
        stake_key: wallet.stake_key,
        wallet_type: Some(wallet.wallet_type),
        active: account_info.active,
        balance: account_info.controlled_amount,
        rewards: account_info.rewards_sum,
    }))
}
