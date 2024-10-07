import {useEffect, useState} from "react";
import {writeText} from "@tauri-apps/plugin-clipboard-manager";
import {isPermissionGranted, requestPermission, sendNotification} from "@tauri-apps/plugin-notification";
import {useLoaderData} from "react-router-dom";
import Database from "@tauri-apps/plugin-sql";
import {updateNoteDB} from "./functions/db.js";
import {listen} from "@tauri-apps/api/event";
import {confirm, save} from "@tauri-apps/plugin-dialog";
import {writeTextFile} from "@tauri-apps/plugin-fs";
import {DBNAME} from "./functions/constants.js";
import MDEditor from '@uiw/react-md-editor';
import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
const appWindow = getCurrentWebviewWindow()

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
    const [isSaved, setIsSaved] = useState(true);

    useEffect(() => {
        if (!isSaved) {
            const unlisten = async () => {
                await appWindow.onCloseRequested(async (event) => {
                    const response = await confirm(
                        "The current note is unsaved, do you really wan`t to close the editor?",
                        {title: 'warning', type: 'warning'}
                    )

                    if (!response) {
                        event.preventDefault();
                    }
                })
            }
            unlisten();
        }
    }, []);

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

    async function saveToFile() {
        try {
            let filePath = await save({
                filters: [{name: "Markdown", extensions: ["md"]}]
            });

            await writeTextFile({contents: note.note_text, path: filePath});
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

    return (
        <div className="m-2">
            <div className="flex justify-between items-center pb-2">
                <h1>Editor</h1>
                <div className="join">
                    <button className="btn btn-sm btn-primary join-item" onClick={async () => {
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
                    <button className="btn btn-sm btn-primary join-item" onClick={async () => {
                        await updateNoteDB(db, noteUUID, note).then(() => {
                            setIsSaved(true);
                        });

                    }}>Save
                    </button>
                    <button className="btn btn-sm btn-primary join-item" onClick={async () => {
                        await saveToFile();
                    }}>Export
                    </button>
                </div>
            </div>
            {isRendered ?
                <div className="prose" dangerouslySetInnerHTML={markdownHtml}></div>
                :
                <div className="w-full h-full">
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-1/6">
                            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-2"
                                   htmlFor="title">Title</label>
                        </div>
                        <div className="md:w-5/6">
                            <input
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                                name="title" id="title" value={note.title} onChange={(e) => {
                                setNote({...note, title: e.target.value});
                                setIsSaved(false);
                            }}/>
                        </div>
                    </div>
                    <MDEditor
                        value={note.note_text}
                        height={450}
                        preview="edit"
                        visibleDragbar={false}
                        textareaProps={{rows: 50, placeholder: "Please enter Markdown text"}}
                        onChange={(value, viewUpdate) => {
                            note.note_text = value;
                            setNote({...note, note_text: value});
                            setIsSaved(false);
                        }}
                    />
                </div>
            }
        </div>
    )
}

export default Editor;