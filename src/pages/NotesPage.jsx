import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { NotesList } from "../components/NotesList.jsx";
import { PlusIcon } from "../components/icons/PlusIcon.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useWindowManager } from "../hooks/useWindowManager.js";

export function NotesPage() {
  const { notes, handleSearch, createNote, removeNote } = useNotes();
  const { openWindow } = useWindowManager();

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

  return (
    <div className="bg-gray-700 h-screen p-2">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-white font-bold">All notes</h1>
        <Button variant="ghost" size="sm" className="btn-square" onClick={handleAddNote}>
          <PlusIcon />
        </Button>
      </div>
      <Input
        placeholder="search"
        className="my-2 w-full"
        size="sm"
        onChange={handleSearchChange}
      />
      <NotesList
        notes={notes}
        onOpenNote={handleOpenNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}