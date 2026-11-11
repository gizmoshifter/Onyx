use serde_json::Value;
use std::time::Duration;

#[tauri::command]
fn app_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[tauri::command]
async fn get_live_game_data() -> Result<Option<Value>, String> {
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .connect_timeout(Duration::from_millis(800))
        .timeout(Duration::from_secs(3))
        .build()
        .map_err(|error| error.to_string())?;

    let response = match client
        .get("https://127.0.0.1:2999/liveclientdata/allgamedata")
        .send()
        .await
    {
        Ok(response) => response,
        Err(error) if error.is_connect() || error.is_timeout() => return Ok(None),
        Err(error) => return Err(error.to_string()),
    };

    if !response.status().is_success() {
        return Ok(None);
    }

    response
        .json::<Value>()
        .await
        .map(Some)
        .map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_version, get_live_game_data])
        .run(tauri::generate_context!())
        .expect("error while running Onyx");
}
