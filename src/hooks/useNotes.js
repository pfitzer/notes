import { useState, useEffect, useCallback } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  getAllNotes,
  searchNotes,
  addNote,
  updateNote,
  deleteNote,
  getNotesWithTags,
  getTagsForNote,
} from "../services/database.js";
import { useDatabase } from "../contexts/DatabaseContext.jsx";

export function useNotes() {
  const { db, isReady } = useDatabase();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotes = useCallback(async () => {
    if (!db) return;

    try {
      setLoading(true);
      const result = await getNotesWithTags(db);
      setNotes(result);
      setError(null);
    } catch (err) {
      console.error("Failed to load notes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const handleSearch = useCallback(
    async (query) => {
      if (!db) return;

      try {
        setLoading(true);
        const result = await searchNotes(db, query);

        // Load tags for each note
        for (const note of result) {
          note.tags = await getTagsForNote(db, note.note_id);
        }

        setNotes(result);
        setError(null);
      } catch (err) {
        console.error("Failed to search notes:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [db]
  );

  const createNote = useCallback(
    async (noteData = { title: "NEW NOTE", note_text: "" }) => {
      if (!db) {
        console.error("Database not initialized");
        return null;
      }

      try {
        const newId = crypto.randomUUID();
        await addNote(db, newId, noteData);
        await loadNotes();
        return newId;
      } catch (err) {
        console.error("Failed to create note:", err);
        setError(err);
        return null;
      }
    },
    [db, loadNotes]
  );

  const removeNote = useCallback(
    async (noteId) => {
      if (!db) return;

      try {
        await deleteNote(db, noteId);
        await loadNotes();
      } catch (err) {
        console.error("Failed to remove note:", err);
        setError(err);
      }
    },
    [db, loadNotes]
  );

  useEffect(() => {
    if (!isReady || !db) return;

    loadNotes();

    const unlistenPromise = listen("db", () => {
      loadNotes();
    });

    return () => {
      unlistenPromise.then(
        (unlisten) => typeof unlisten === "function" && unlisten()
      );
    };
  }, [db, isReady, loadNotes]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    handleSearch,
    createNote,
    removeNote,
  };
}