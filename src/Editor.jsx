import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api";
import {writeText} from "@tauri-apps/api/clipboard";
import {
    isPermissionGranted, requestPermission, sendNotification
} from "@tauri-apps/api/notification";
import {useLoaderData} from "react-router-dom";
import Database from "tauri-plugin-sql-api";
import {updateNoteDB} from "./functions/db.js";
import {listen} from "@tauri-apps/api/event";
import {save} from "@tauri-apps/api/dialog";
import {writeTextFile} from "@tauri-apps/api/fs";
import {DBNAME} from "./functions/constants.js";
import MDEditor from '@uiw/react-md-editor';

export async function loader({params}) {
    const noteID = params.noteID;
    return {noteUUID: noteID}
}

function Editor() {
    const {noteUUID} = useLoaderData();
    const [note, setNote] = useState({})
    const [isRendered, setRender] = useState(false)
    const [markdownHtml, setMarkdownHtml] = useState("")
    const [db, setDB] = useState("")
    const [menuEventPayload, setEventPayload] = useState("");

    useEffect(() => {
        loadNoteFromDB();

        let unlisten;

        unlisten = listen("tauri://menu", (e) => {
            setEventPayload({payload: e.payload, id: e.id});
        });

        return () => {
            if (unlisten) {
                unlisten.then(resolvedUnlisten => typeof resolvedUnlisten === 'function' && resolvedUnlisten());
            }
        }
    }, [])

    useEffect(() => {
        if (menuEventPayload === "") {
            return;
        }
        const menuPayload = menuEventPayload.payload;
        switch (menuPayload) {
            case "export":
                saveToFile();
                break;
            default:
                break;
        }
    }, [menuEventPayload]);

    function updateTitle(e) {
        note.title = e.target.value;
        // setNote(note);
        console.log(note);
    }

    async function saveToFile() {
        try {
            let filePath = await save({
                filters: [{name: "Markdown", extensions: ["md"]}]
            });

            await writeTextFile({contents: note, path: filePath});
        } catch (e) {
            console.log(e);
        }
    }

    async function loadNoteFromDB() {
        const loadedDB = await Database.load("sqlite:" + DBNAME);
        const result = await loadedDB.select("SELECT * FROM notes WHERE  note_id = $1;", [noteUUID]);
        setNote(result[0]);
        setDB(loadedDB);
    }

    async function renderMarkdown() {
        if (!isRendered) {
            const response = await invoke("convert_markdown", {text: note});
            setMarkdownHtml({__html: response});
        }
        setRender(!isRendered)
    }

    return (
        <div className="m-2">
            <div className="flex justify-between items-center pb-2">
                <h1>Editor</h1>
                <div className="join">
                    <label className="btn btn-sm join join-item swap">
                        <input className="join" onChange={async () => {
                            await renderMarkdown();
                        }} type="checkbox"></input>
                        <div className="swap-on">HTML</div>
                        <div className="swap-off">MD</div>
                    </label>
                    <button className="btn btn-sm join-item" onClick={async () => {
                        await writeText(note.note_text);
                        let permissionGranted = await isPermissionGranted()
                        if (!permissionGranted) {
                            const permission = await requestPermission();
                            permissionGranted = permission === "granted";
                        }
                        if (permissionGranted) {
                            sendNotification({title: "Notes", body: "Note text copied."});
                        }
                    }}>Copy
                    </button>
                    <button className="btn btn-sm join-item" onClick={async () => {
                        await updateNoteDB(db, noteUUID, note);
                    }}>Save
                    </button>
                </div>
            </div>
            {isRendered ?
                <div className="prose" dangerouslySetInnerHTML={markdownHtml}></div>
                :
                <div className="w-full h-full">
                    <label className="mb-2" htmlFor="title">Title</label>
                    <input className="p-2 mb-2" name="title" id="title" value={note.title ? note.title : ''} onChange={(e) => {
                        updateTitle(e);
                    }} />
                    <MDEditor
                        value={note.note_text}
                        height={450}
                        preview="edit"
                        visibleDragbar={false}
                        textareaProps={{rows: 50, placeholder: "Please enter Markdown text"}}
                        onChange={(value, viewUpdate) => {
                            note.note_text = value;
                            setNote(note);
                        }}
                    />
                </div>
            }
        </div>
    )
}

export default Editor;