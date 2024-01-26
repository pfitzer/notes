// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{CustomMenuItem, Manager, Menu, Submenu, Window};
use tauri::api::dialog::message;
use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let about = CustomMenuItem::new("about".to_string(), "About");
    let submenu = Submenu::new("File", Menu::new().add_item(about).add_item(quit));
    let menu = Menu::new()
        .add_submenu(submenu);

    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "add new column title",
            sql: "ALTER TABLE notes ADD COLUMN title TEXT;",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                "about" => {
                    call_about(event.window().clone());
                }
                _ => {}
            }
        })
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
    ).build().unwrap();

    editor_window.set_title("Editor").unwrap();
    Ok(())
}

#[tauri::command]
fn call_about(window: tauri::Window) {
    let label = window.label();
    let parent_window = window.get_window(label).unwrap();
    tauri::async_runtime::spawn(async move {
        message(Some(&parent_window), "About", "MIT License\n\nCopyright (c) 2024 Michael Pfister
        ");
    });
}
