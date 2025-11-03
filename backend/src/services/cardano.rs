use reqwest::Client;
use serde::Deserialize;

pub struct CardanoService {
    client: Client,
    api_key: String,
    base_url: String,
}

#[derive(Deserialize, Debug)]
pub struct AccountInfo {
    pub stake_address: String,
    pub active: bool,
    pub controlled_amount: String,
    pub rewards_sum: String,
}

impl CardanoService {
    pub fn new(api_key: String, base_url: String) -> Self {

        Self {
            client: Client::new(),
            api_key,
            base_url,
        }
    }

    pub async fn get_account_info(&self, stake_key: &str) -> Result<AccountInfo, Box<dyn std::error::Error>> {
        let url = format!("{}/accounts/{}", self.base_url, stake_key);

        let response = self.client
            .get(&url)
            .header("project_id", &self.api_key)
            .send()
            .await?;

        let text = response.text().await?;
        eprintln!("Blockfrost response: {}", text);

        serde_json::from_str(&text).map_err(|e| {
            eprintln!("Parse error: {}", e);
            Box::new(e) as Box<dyn std::error::Error>
        })
    }
}
