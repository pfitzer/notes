import {useState} from "react";
import {invoke} from "@tauri-apps/api";
import {writeText} from "@tauri-apps/api/clipboard";
import {
    isPermissionGranted, requestPermission, sendNotification
} from "@tauri-apps/api/notification";

function Editor() {
    const [note, setNote] = useState("Hello")
    const [isRendered, setRender] = useState(false)
    const [markdownHtml, setMarkdownHtml] = useState("")

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
                        await writeText(note);
                        let permissionGranted = await isPermissionGranted()
                        if (!permissionGranted) {
                            const permission = await requestPermission();
                            permissionGranted = permission === "granted";
                        }
                        if (permissionGranted) {
                            sendNotification({title: "Tauri", body: "Copy text."});
                        }
                    }}>Copy
                    </button>
                </div>
            </div>
            {isRendered ?
                <div className="prose" dangerouslySetInnerHTML={markdownHtml}></div>
                :
                <textarea value={note} onChange={(e) => {
                    setNote(e.target.value)
                }} className="w-full" rows={20}/>
            }
        </div>
    )
}

export default Editor;