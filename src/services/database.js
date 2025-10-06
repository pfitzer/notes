import Database from "@tauri-apps/plugin-sql";
import { emit } from "@tauri-apps/api/event";
import { DBNAME } from "../constants/index.js";

/**
 * Initialize database connection
 */
export async function initDatabase() {
  try {
    const db = await Database.load(`sqlite:${DBNAME}`);
    await db.execute(
      "CREATE TABLE IF NOT EXISTS notes (note_id CHAR NOT NULL PRIMARY KEY, title TEXT, note_text TEXT DEFAULT NULL);"
    );
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

/**
 * Get all notes from database
 */
export async function getAllNotes(db) {
  return await db.select("SELECT * FROM notes;");
}

/**
 * Get a single note by ID
 */
export async function getNoteById(db, noteId) {
  const result = await db.select(
    "SELECT * FROM notes WHERE note_id = $1;",
    [noteId]
  );
  return result[0];
}

/**
 * Search notes by query string
 */
export async function searchNotes(db, query) {
  if (!query) {
    return await getAllNotes(db);
  }

  const searchPattern = `%${query}%`;
  return await db.select(
    "SELECT * FROM notes WHERE note_text LIKE $1 OR title LIKE $1",
    [searchPattern]
  );
}

/**
 * Add a new note to database
 */
export async function addNote(db, uuid, note) {
  return await db.execute(
    "INSERT INTO notes (note_id, title, note_text) VALUES ($1, $2, $3);",
    [uuid, note.title, note.note_text]
  );
}

/**
 * Update an existing note
 */
export async function updateNote(db, uuid, note) {
  const result = await db.execute(
    "UPDATE notes SET note_text = $2, title = $3 WHERE note_id = $1;",
    [uuid, note.note_text, note.title]
  );
  await emit("db", { message: "save" });
  return result;
}

/**
 * Delete a note by ID
 */
export async function deleteNote(db, uuid) {
  return await db.execute("DELETE FROM notes WHERE note_id = $1;", [uuid]);
}