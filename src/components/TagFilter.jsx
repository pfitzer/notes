import { Tag } from './Tag';

export function TagFilter({ availableTags = [], selectedTags = [], onToggleTag, onClearAll }) {
  if (availableTags.length === 0) {
    return null;
  }

  const isSelected = (tag) => {
    return selectedTags.some(t => t.tag_id === tag.tag_id);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-200">Filter by tags:</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <Tag
            key={tag.tag_id}
            tag={tag}
            onClick={() => onToggleTag(tag)}
            className={`
              transition-opacity
              ${isSelected(tag) ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
