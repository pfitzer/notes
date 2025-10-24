import { TrashIcon } from "./icons/TrashIcon.jsx";
import { Button } from "./Button.jsx";
import { Tag } from "./Tag.jsx";

export function NoteItem({ note, onOpen, onDelete }) {
  return (
    <div className="p-2 flex flex-col bg-primary rounded-md text-white mb-1">
      <div className="flex flex-row justify-between items-start mb-1">
        <div
          className="cursor-pointer flex-1 min-h-6"
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
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {note.tags.map((tag) => (
            <Tag key={tag.tag_id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}