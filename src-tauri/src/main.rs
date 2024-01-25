// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{CustomMenuItem, Menu, Submenu, Window};
use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "ALTER TABLE notes ADD COLUMN title TEXT;",
            kind: MigrationKind::Up,
        }
    ];
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_markdown, open_editor])
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:notes.sqlite", migrations)
            .build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn convert_markdown(text: &str) -> String {
    let html: String = markdown::to_html(text);
    html
}

#[tauri::command]
async fn open_editor(handle: tauri::AppHandle, editor_id: &str) -> Result<(), tauri::Error> {
    let editor_window: Window = tauri::WindowBuilder::new(
        &handle, editor_id, tauri::WindowUrl::App(("editor/".to_string() + editor_id).parse().unwrap()),
    )
        .menu(Menu::new().add_submenu(
            Submenu::new(
                "File", Menu::new()
                    .add_item(CustomMenuItem::new(
                        "export", "Export File",
                    )
                        .accelerator("cmdOrControl+E")
                    ),
            )))
        .build()
        .unwrap();

    editor_window.set_title("Editor").unwrap();
    Ok(())
}
