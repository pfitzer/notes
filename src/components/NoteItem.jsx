import { TrashIcon } from "./icons/TrashIcon.jsx";
import { Button } from "./Button.jsx";

export function NoteItem({ note, onOpen, onDelete }) {
  return (
    <div className="p-1 flex flex-row justify-between items-center bg-primary rounded-md text-white mb-1">
      <div
        className="cursor-pointer w-full h-full min-h-6"
        onClick={() => onOpen(note.note_id)}
      >
        {note.title}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="btn-square"
        onClick={() => onDelete(note.note_id)}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}