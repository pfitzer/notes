import Editor from "./Editor.jsx";
import {useEffect, useState} from "react";
import Database from "tauri-plugin-sql-api";
import {addNoteDB, getSearch, removeNoteDB} from "./functions/db.js";

function App() {

    const [notes, setNotes] = useState([]);
    const [db, setDB] = useState("")
    const noteItems = notes.map((item) =>
        <div className="flex flex-row justify-between items-center bg-green-200 border-4 border-green-700">
            <div className="bg-green-50 cursor-pointer w-full h-full"><h2>{item.note_text}</h2></div>
            <button className="btn btn-sm" onClick={() => {handleRemoveNote(item.note_id)}}>Delete me</button>
        </div>
    );

    async function createDB(db) {
        const loadedDB = await Database.load('sqlite:test.db');
        const _first_load = await loadedDB.execute(
            "CREATE TABLE IF NOT EXISTS notes (note_id CHAR NOT NULL PRIMARY KEY, note_text TEXT DEAFULT NULL);"
        );

        // const result2 = await loadedDB.execute("INSERT INTO notes (note_id, note_text) VALUES ($1, $2)", [crypto.randomUUID(), "DEMO"])
        setDB(loadedDB);
        loadNotes(loadedDB);
    }

    async function loadNotes(db) {
        const result = await db.select("SELECT * FROM notes;");
        setNotes(result);
    }

    async function handleSearch(event) {
        const result = await getSearch(db, event.target.value);
        setNotes(result);
    }

    async function handleRemoveNote(uuid) {
        await removeNoteDB(db, uuid);
        await loadNotes(db);
    }

    async function addNote() {
        const newId = crypto.randomUUID();
        await addNoteDB(db, newId, "");
        await loadNotes(db);
    }

    useEffect(() => {
        createDB();
    }, []);

    return (
        <div className="bg-gray-700 h-screen p-2">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-white font-bold">All notes</h1>
                <button className="btn btn-sm" onClick={() => {addNote()}}>Add notes</button>
            </div>
            <input className="my-2 w-full input" onChange={(e) => {
                handleSearch(e)
            }}></input>
            {noteItems}
        </div>
    );
}

export default App;
