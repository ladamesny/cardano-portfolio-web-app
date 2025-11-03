use sea_orm_migration::{prelude::*, schema::*};
use super::m20251031_124031_create_wallets_table::Wallet;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Address::Table)
                    .if_not_exists()
                    .col(pk_auto(Address::Id))
                    .col(integer(Address::WalletId).not_null())
                    .foreign_key(
                            ForeignKey::create()
                            .name("fk_address_wallet")
                            .from(Address::Table, Address::WalletId)
                            .to(Wallet::Table, Wallet::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .col(string(Address::Address).not_null())
                    .col(timestamp_with_time_zone(Address::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp_with_time_zone(Address::UpdatedAt).default(Expr::current_timestamp()))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Address::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Address {
    Table,
    Id,
    WalletId,
    Address,
    CreatedAt,
    UpdatedAt
}
