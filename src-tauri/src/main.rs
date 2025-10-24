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
        },
        Migration {
            version: 2,
            description: "create tags table",
            sql: "CREATE TABLE IF NOT EXISTS tags (
                tag_id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                color TEXT NOT NULL DEFAULT '#3b82f6'
            );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create note_tags junction table",
            sql: "CREATE TABLE IF NOT EXISTS note_tags (
                note_id TEXT NOT NULL,
                tag_id TEXT NOT NULL,
                PRIMARY KEY (note_id, tag_id),
                FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
            );",
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
            let help = MenuItem::with_id(app, "help", "Help", true, None::<&str>)?;
            let about = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&help, &about, &quit])?;

            app.set_menu(menu)?;
            app.on_menu_event(move |app, event| {
                match event.id().as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "help" => {
                        if let Some(window) = app.get_webview_window("main") {
                            call_help(window);
                        }
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
        let version = env!("CARGO_PKG_VERSION");
        let message = format!("Version {}\n\nMIT License\n\nCopyright (c) 2024 Michael Pfister", version);
        let _ = window.app_handle().dialog()
            .message(message)
            .title("About")
            .parent(&window)
            .blocking_show();
    });
}

fn call_help(window: tauri::WebviewWindow) {
    tauri::async_runtime::spawn(async move {
        let help_text = "\
📝 Notes Application - Usage Instructions

BASIC FEATURES:
• Create, edit, and manage notes with Markdown support
• Organize notes with color-coded tags
• Search and filter notes by text or tags
• Export notes to files
• Copy note content to clipboard
• Multiple editor windows support

TAGS:
• Add tags in the editor by typing and pressing Enter
• Click tags in the notes list to filter by tag
• Tags are color-coded and shared across all notes
• Remove tags by clicking the × button

KEYBOARD SHORTCUTS:

Notes List Page:
  Ctrl/Cmd + N    Create a new note
  Ctrl/Cmd + F    Focus on search input

Editor Page:
  Ctrl/Cmd + S    Save the current note

TIPS:
• Notes are automatically stored in a local SQLite database
• Use Markdown formatting for rich text editing
• The editor shows an asterisk (*) when there are unsaved changes
• Closing an editor with unsaved changes will prompt for confirmation
• Filter multiple tags to find notes with any of the selected tags

For more information, visit:
https://github.com/pfitzer/notes";

        let _ = window.app_handle().dialog()
            .message(help_text)
            .title("Help")
            .parent(&window)
            .blocking_show();
    });
}