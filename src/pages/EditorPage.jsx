import { useEffect } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import MDEditor from "@uiw/react-md-editor";
import { EditorToolbar } from "../components/EditorToolbar.jsx";
import { useEditor } from "../hooks/useEditor.js";
import { useNotifications } from "../hooks/useNotifications.js";
import { useFileExport } from "../hooks/useFileExport.js";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut.js";

export function EditorPage() {
  const { note, isSaved, loading, menuEvent, updateNoteContent, saveNote } =
    useEditor();
  const { notify } = useNotifications();
  const { exportToFile } = useFileExport();

  // Handle menu events
  useEffect(() => {
    if (!menuEvent) return;

    const { payload } = menuEvent;
    if (payload === "export") {
      handleExport();
    }
  }, [menuEvent]);

  const handleCopy = async () => {
    await writeText(note.note_text || "");
    await notify("Notes", "Note text copied.");
  };

  const handleSave = async () => {
    const success = await saveNote();
    if (success) {
      await notify("Notes", "Note saved successfully.");
    } else {
      await notify("Notes", "Failed to save note.");
    }
  };

  const handleExport = async () => {
    await exportToFile(note.note_text || "");
  };

  const handleTitleChange = (e) => {
    updateNoteContent({ title: e.target.value });
  };

  const handleContentChange = (value) => {
    updateNoteContent({ note_text: value });
  };

  // Keyboard shortcut for saving (Ctrl+S / Cmd+S)
  useKeyboardShortcut('s', handleSave, { ctrl: true });

  if (loading) {
    return (
      <div className="m-2 flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="m-2">
      <EditorToolbar
        onCopy={handleCopy}
        onSave={handleSave}
        onExport={handleExport}
        isSaved={isSaved}
      />
      <div className="w-full h-full">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/6">
            <label
              className="block text-gray-500 font-bold mb-1 md:mb-0 pr-2"
              htmlFor="title"
            >
              Title
            </label>
          </div>
          <div className="md:w-5/6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
              name="title"
              id="title"
              value={note.title || ""}
              onChange={handleTitleChange}
            />
          </div>
        </div>
        <MDEditor
          value={note.note_text || ""}
          height={450}
          preview="edit"
          visibleDragbar={false}
          textareaProps={{
            rows: 50,
            placeholder: "Please enter Markdown text",
          }}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}