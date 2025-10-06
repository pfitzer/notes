import { useState, useEffect, useCallback, useRef } from "react";
import { useLoaderData } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { ask } from "@tauri-apps/plugin-dialog";
import { getNoteById, updateNote } from "../services/database.js";
import { useDatabase } from "../contexts/DatabaseContext.jsx";

export function useEditor() {
  const { noteUUID } = useLoaderData();
  const { db } = useDatabase();
  const [note, setNote] = useState({});
  const [isSaved, setIsSaved] = useState(true);
  const isSavedRef = useRef(true);
  const [menuEvent, setMenuEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load note from database
  useEffect(() => {
    async function loadNote() {
      if (!db) return;

      try {
        setLoading(true);
        const loadedNote = await getNoteById(db, noteUUID);
        setNote(loadedNote || {});
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [db, noteUUID]);

  // Listen for menu events
  useEffect(() => {
    const unlistenPromise = listen("tauri://menu", (e) => {
      setMenuEvent({ payload: e.payload, id: e.id });
    });

    return () => {
      unlistenPromise.then(
        (unlisten) => typeof unlisten === "function" && unlisten()
      );
    };
  }, []);

  // Update ref whenever isSaved changes
  useEffect(() => {
    isSavedRef.current = isSaved;
  }, [isSaved]);

  // Handle unsaved changes on window close
  useEffect(() => {
    if (!isSaved) {
      let unlisten;

      const setupCloseHandler = async () => {
        const appWindow = getCurrentWindow();
        unlisten = await appWindow.onCloseRequested(async (event) => {
          event.preventDefault(); // Always prevent default first

          const response = await ask(
            "The current note is unsaved, do you really want to close the editor?",
            { title: "Warning", kind: "warning" }
          );

          // If user says Yes, remove handler and close the window
          if (response) {
            if (unlisten) {
              unlisten();
            }
            await appWindow.close();
          }
          // If user says No, do nothing (already prevented)
        });
      };

      setupCloseHandler();

      return () => {
        if (unlisten) {
          unlisten();
        }
      };
    }
  }, [isSaved]);

  const updateNoteContent = useCallback((updates) => {
    setNote((prev) => ({ ...prev, ...updates }));
    setIsSaved(false);
    isSavedRef.current = false;
  }, []);

  const saveNote = useCallback(async () => {
    if (!db) {
      console.error("Database not initialized");
      return false;
    }

    try {
      await updateNote(db, noteUUID, note);
      setIsSaved(true);
      isSavedRef.current = true;
      return true;
    } catch (err) {
      console.error("Failed to save note:", err);
      return false;
    }
  }, [db, noteUUID, note]);

  return {
    note,
    isSaved,
    loading,
    menuEvent,
    updateNoteContent,
    saveNote,
  };
}