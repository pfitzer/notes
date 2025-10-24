import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import {
  getAllTags,
  getTagsForNote,
  getOrCreateTag,
  addTagToNote,
  removeTagFromNote,
} from '../services/database';

export function useTags(noteId = null) {
  const { db, isReady } = useDatabase();
  const [allTags, setAllTags] = useState([]);
  const [noteTags, setNoteTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all available tags
  const loadAllTags = useCallback(async () => {
    if (!db) return;

    try {
      setLoading(true);
      const tags = await getAllTags(db);
      setAllTags(tags);
      setError(null);
    } catch (err) {
      console.error('Failed to load tags:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Load tags for a specific note
  const loadNoteTags = useCallback(async () => {
    if (!db || !noteId) return;

    try {
      setLoading(true);
      const tags = await getTagsForNote(db, noteId);
      setNoteTags(tags);
      setError(null);
    } catch (err) {
      console.error('Failed to load note tags:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [db, noteId]);

  // Add a tag to the note
  const addTag = useCallback(
    async (tagData) => {
      if (!db || !noteId) {
        console.error('Database or noteId not available');
        return;
      }

      try {
        // Get or create the tag
        const tag = await getOrCreateTag(db, tagData.name, tagData.color);

        // Add tag to note
        await addTagToNote(db, noteId, tag.tag_id);

        // Reload tags
        await loadNoteTags();
        await loadAllTags();
      } catch (err) {
        console.error('Failed to add tag:', err);
        setError(err);
      }
    },
    [db, noteId, loadNoteTags, loadAllTags]
  );

  // Remove a tag from the note
  const removeTag = useCallback(
    async (tag) => {
      if (!db || !noteId) {
        console.error('Database or noteId not available');
        return;
      }

      try {
        await removeTagFromNote(db, noteId, tag.tag_id);
        await loadNoteTags();
      } catch (err) {
        console.error('Failed to remove tag:', err);
        setError(err);
      }
    },
    [db, noteId, loadNoteTags]
  );

  // Load tags on mount and when dependencies change
  useEffect(() => {
    if (!isReady || !db) return;

    loadAllTags();

    if (noteId) {
      loadNoteTags();
    }
  }, [db, isReady, noteId, loadAllTags, loadNoteTags]);

  return {
    allTags,
    noteTags,
    loading,
    error,
    addTag,
    removeTag,
    refreshTags: loadNoteTags,
    refreshAllTags: loadAllTags,
  };
}
