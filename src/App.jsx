import {useEffect, useState} from "react";
import Database from "tauri-plugin-sql-api";
import {addNoteDB, getSearch, removeNoteDB} from "./functions/db.js";
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
import {DBNAME} from "./functions/constants.js";

function App() {

    const [notes, setNotes] = useState([]);
    const [db, setDB] = useState("")
    let headline;
    const noteItems = notes.map((item) =>
        <div key={item.note_id}
             className="p-1 flex flex-row justify-between items-center bg-green-700">
            <div className="bg-green-200 cursor-pointer w-full h-full min-h-6" onClick={async () => {
                await handleOpenWindow(item.note_id)
            }}>{item.note_text.split('\n')[0]}</div>
            <button className="btn btn-sm btn-square btn-ghost" onClick={() => {
                handleRemoveNote(item.note_id)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="#f20707" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-trash-2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
            </button>
        </div>
    );
    const [listOfOpenWindows, setListOfOpenWindows] = useState([]);

    useEffect(() => {
        createDB();
    }, []);

    useEffect(() => {
        if (db === '') {
            return;
        }
        const unlistenPromises = [];

        unlistenPromises.push(listen("db", (e) => {
            loadNotes(db);
        }));
        unlistenPromises.push(listen("tauri://close-requested", (e) => {
            setListOfOpenWindows(listOfOpenWindows.filter((items) => items !== e.windowLabel));
        }));

        return () => {
            unlistenPromises.forEach(unlistenPromises => {
                unlistenPromises.then(resolvedUnlisten => typeof resolvedUnlisten === 'function' && resolvedUnlisten());
            });
        }
    }, [db, listOfOpenWindows]);

    async function createDB(db) {
        const loadedDB = await Database.load('sqlite:' + DBNAME);
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

    async function handleOpenWindow(uuid) {
        if (listOfOpenWindows.includes(uuid)) {
            return;
        }
        setListOfOpenWindows([...listOfOpenWindows, uuid]);
        await invoke("open_editor", {editorId: String(uuid)})
    }

    return (
        <div className="bg-gray-700 h-screen p-2">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-white font-bold">All notes</h1>
                <button className="btn btn-sm btn-square btn-ghost" onClick={() => {
                    addNote()
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="#f6f7f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-plus">
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                </button>
            </div>
            <input className="my-2 w-full input input-sm" onChange={(e) => {
                handleSearch(e)
            }}></input>
            {noteItems}
        </div>
    );
}

export default App;
