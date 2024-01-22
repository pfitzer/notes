 // Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler!(convert_markdown))
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

 #[tauri::command]
 fn convert_markdown(text: &str) -> String {
     let html: String = markdown::to_html(text);
     html
 }
