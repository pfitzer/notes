import { Button } from "./Button.jsx";

export function EditorToolbar({ onCopy, onSave, onExport, isSaved }) {
  return (
    <div className="flex justify-between items-center pb-2">
      <h1>Editor</h1>
      <div className="join">
        <Button
          variant="primary"
          size="sm"
          className="join-item"
          onClick={onCopy}
        >
          Copy
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="join-item"
          onClick={onSave}
        >
          {isSaved ? "Save" : "Save *"}
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="join-item"
          onClick={onExport}
        >
          Export
        </Button>
      </div>
    </div>
  );
}