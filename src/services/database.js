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

// ============================================
// TAG FUNCTIONS
// ============================================

/**
 * Get all tags from database
 */
export async function getAllTags(db) {
  return await db.select("SELECT * FROM tags ORDER BY name;");
}

/**
 * Get tags for a specific note
 */
export async function getTagsForNote(db, noteId) {
  return await db.select(
    `SELECT t.* FROM tags t
     INNER JOIN note_tags nt ON t.tag_id = nt.tag_id
     WHERE nt.note_id = $1
     ORDER BY t.name;`,
    [noteId]
  );
}

/**
 * Create a new tag
 */
export async function createTag(db, tagId, name, color = '#3b82f6') {
  return await db.execute(
    "INSERT INTO tags (tag_id, name, color) VALUES ($1, $2, $3);",
    [tagId, name, color]
  );
}

/**
 * Get or create a tag by name
 */
export async function getOrCreateTag(db, name, color = '#3b82f6') {
  // Try to find existing tag
  const existing = await db.select(
    "SELECT * FROM tags WHERE name = $1;",
    [name]
  );

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new tag
  const tagId = crypto.randomUUID();
  await createTag(db, tagId, name, color);
  return { tag_id: tagId, name, color };
}

/**
 * Add a tag to a note
 */
export async function addTagToNote(db, noteId, tagId) {
  return await db.execute(
    "INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES ($1, $2);",
    [noteId, tagId]
  );
}

/**
 * Remove a tag from a note
 */
export async function removeTagFromNote(db, noteId, tagId) {
  return await db.execute(
    "DELETE FROM note_tags WHERE note_id = $1 AND tag_id = $2;",
    [noteId, tagId]
  );
}

/**
 * Delete a tag (and all its associations)
 */
export async function deleteTag(db, tagId) {
  return await db.execute("DELETE FROM tags WHERE tag_id = $1;", [tagId]);
}

/**
 * Get all notes with a specific tag
 */
export async function getNotesByTag(db, tagId) {
  return await db.select(
    `SELECT n.* FROM notes n
     INNER JOIN note_tags nt ON n.note_id = nt.note_id
     WHERE nt.tag_id = $1;`,
    [tagId]
  );
}

/**
 * Get all notes with their tags
 */
export async function getNotesWithTags(db) {
  const notes = await getAllNotes(db);

  // Get tags for each note
  for (const note of notes) {
    note.tags = await getTagsForNote(db, note.note_id);
  }

  return notes;
}

/**
 * Search notes by tag names
 */
export async function searchNotesByTags(db, tagNames) {
  if (!tagNames || tagNames.length === 0) {
    return await getNotesWithTags(db);
  }

  const placeholders = tagNames.map((_, i) => `$${i + 1}`).join(',');
  const notes = await db.select(
    `SELECT DISTINCT n.* FROM notes n
     INNER JOIN note_tags nt ON n.note_id = nt.note_id
     INNER JOIN tags t ON nt.tag_id = t.tag_id
     WHERE t.name IN (${placeholders});`,
    tagNames
  );

  // Get tags for each note
  for (const note of notes) {
    note.tags = await getTagsForNote(db, note.note_id);
  }

  return notes;
}