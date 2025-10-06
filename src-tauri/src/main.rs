// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Emitter, Manager, menu::{Menu, MenuItem}, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
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
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:notes.sqlite", migrations)
            .build())
        .setup(|app| {
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let about = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&about, &quit])?;

            app.set_menu(menu)?;
            app.on_menu_event(move |app, event| {
                match event.id().as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "about" => {
                        if let Some(window) = app.get_webview_window("main") {
                            call_about(window);
                        }
                    }
                    _ => {}
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_editor])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn open_editor(app: tauri::AppHandle, editor_id: &str) -> Result<(), tauri::Error> {
    let url = format!("editor/{}", editor_id);
    let editor_id_clone = editor_id.to_string();
    let app_clone = app.clone();

    let editor_window = WebviewWindowBuilder::new(
        &app,
        editor_id,
        WebviewUrl::App(url.into())
    )
    .title("Editor")
    .build()?;

    editor_window.on_window_event(move |event| {
        if let tauri::WindowEvent::Destroyed = event {
            let _ = app_clone.emit("window-closed", editor_id_clone.clone());
        }
    });

    Ok(())
}

fn call_about(window: tauri::WebviewWindow) {
    tauri::async_runtime::spawn(async move {
        let _ = window.app_handle().dialog()
            .message("MIT License\n\nCopyright (c) 2024 Michael Pfister")
            .title("About")
            .parent(&window)
            .blocking_show();
    });
}