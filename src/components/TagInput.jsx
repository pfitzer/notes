import { useState } from 'react';
import { Tag } from './Tag';
import { Input } from './Input';

const TAG_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export function TagInput({ tags = [], onAddTag, onRemoveTag }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();

      // Check if tag already exists
      if (tags.some(tag => tag.name.toLowerCase() === inputValue.trim().toLowerCase())) {
        setInputValue('');
        return;
      }

      // Pick a random color
      const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

      onAddTag({
        name: inputValue.trim(),
        color
      });
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      onRemoveTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-2 min-h-[42px] flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <Tag
          key={tag.tag_id || tag.name}
          tag={tag}
          onRemove={onRemoveTag}
        />
      ))}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
        className="flex-1 min-w-[120px] border-none focus:outline-none"
        size="sm"
      />
    </div>
  );
}
