import { NoteItem } from "./NoteItem.jsx";

export function NotesList({ notes, onOpenNote, onDeleteNote }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No notes found. Create one to get started!
      </div>
    );
  }

  return (
    <div>
      {notes.map((note) => (
        <NoteItem
          key={note.note_id}
          note={note}
          onOpen={onOpenNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}