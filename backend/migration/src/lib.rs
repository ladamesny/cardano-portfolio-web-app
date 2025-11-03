pub use sea_orm_migration::prelude::*;

mod m20251031_124024_create_users_table;
mod m20251031_124031_create_wallets_table;
mod m20251031_124036_create_address_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20251031_124024_create_users_table::Migration),
            Box::new(m20251031_124031_create_wallets_table::Migration),
            Box::new(m20251031_124036_create_address_table::Migration),
        ]
    }
}
