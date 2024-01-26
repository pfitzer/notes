import { emit} from "@tauri-apps/api/event";

export async function addNoteDB(db, uuid, note) {
    return await db.execute("INSERT INTO notes (note_id, title, note_text) VALUES ($1, $2, $3);", [uuid, note.title, note.note_text]);
}

export async function updateNoteDB(db, uuid, note) {
    const result = await db.execute("UPDATE notes SET note_text = $2, title = $3 WHERE note_id = $1;", [uuid, note.note_text, note.title]);
    await emit("db", {message: "save"});
    return result;
}

export async function removeNoteDB(db, uuid, text) {
    return await db.execute("DELETE FROM notes WHERE note_id = $1;", [uuid]);
}

export async function getSearch(db, input) {
    return await db.select("SELECT * FROM notes WHERE note_text LIKE '%" + input + "%' OR title LIKE '%" + input + "%' ");
}
