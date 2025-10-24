import { useRef, useState, useMemo } from "react";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { NotesList } from "../components/NotesList.jsx";
import { TagFilter } from "../components/TagFilter.jsx";
import { PlusIcon } from "../components/icons/PlusIcon.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useWindowManager } from "../hooks/useWindowManager.js";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcut.js";
import { useTags } from "../hooks/useTags.js";

export function NotesPage() {
  const { notes, handleSearch, createNote, removeNote } = useNotes();
  const { openWindow } = useWindowManager();
  const { allTags } = useTags();
  const searchInputRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddNote = async () => {
    await createNote();
  };

  const handleOpenNote = async (noteId) => {
    await openWindow(noteId);
  };

  const handleDeleteNote = async (noteId) => {
    await removeNote(noteId);
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.some((t) => t.tag_id === tag.tag_id);
      if (isSelected) {
        return prev.filter((t) => t.tag_id !== tag.tag_id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Filter notes by selected tags
  const filteredNotes = useMemo(() => {
    if (selectedTags.length === 0) {
      return notes;
    }

    return notes.filter((note) => {
      if (!note.tags || note.tags.length === 0) {
        return false;
      }
      // Note must have at least one of the selected tags
      return selectedTags.some((selectedTag) =>
        note.tags.some((noteTag) => noteTag.tag_id === selectedTag.tag_id)
      );
    });
  }, [notes, selectedTags]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      callback: handleAddNote,
    },
    {
      key: 'f',
      ctrl: true,
      callback: () => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      },
    },
  ]);

  return (
    <div className="bg-gray-700 h-screen p-2">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-white font-bold">All notes</h1>
        <Button variant="ghost" size="sm" className="btn-square" onClick={handleAddNote}>
          <PlusIcon />
        </Button>
      </div>
      <Input
        ref={searchInputRef}
        placeholder="search"
        className="my-2 w-full"
        size="sm"
        onChange={handleSearchChange}
      />
      <TagFilter
        availableTags={allTags}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onClearAll={handleClearTags}
      />
      <NotesList
        notes={filteredNotes}
        onOpenNote={handleOpenNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}