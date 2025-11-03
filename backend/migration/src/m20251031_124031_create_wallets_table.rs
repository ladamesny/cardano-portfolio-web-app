use sea_orm_migration::{prelude::*, schema::*};
use super::m20251031_124024_create_users_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Wallet::Table)
                    .if_not_exists()
                    .col(pk_auto(Wallet::Id))
                    .col(integer(Wallet::UserId).not_null())
                    .foreign_key(
                            ForeignKey::create()
                            .name("fk_wallet_user")
                            .from(Wallet::Table, Wallet::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .col(string(Wallet::StakeKey).not_null())
                    .col(string(Wallet::WalletType))
                    .col(timestamp_with_time_zone(Wallet::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp_with_time_zone(Wallet::UpdatedAt).default(Expr::current_timestamp()))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Wallet::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Wallet {
    Table,
    Id,
    UserId,
    StakeKey,
    WalletType,
    CreatedAt,
    UpdatedAt
}
