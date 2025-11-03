use axum::{extract::State, Json, http::StatusCode};
use sea_orm::ActiveModelTrait;
use serde::{Deserialize, Serialize};
use crate::entities::{user, prelude::*};
use crate::AppState;

#[derive(Deserialize)]
pub struct CreateUserRequest {
}

#[derive(Serialize)]
pub struct UserResponse {
    pub id: i32,
}

pub async fn create_user(
    State(state): State<AppState>,
    Json(_payload): Json<CreateUserRequest>,
) -> Result<Json<UserResponse>, StatusCode> {
    let new_user = user::ActiveModel {
        ..Default::default()
    };

    let user = new_user.insert(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(UserResponse { id: user.id}))
}
