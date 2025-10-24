export function Tag({ tag, onRemove, onClick, className = "" }) {
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(tag);
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      } ${className}`}
      style={{ backgroundColor: tag.color || '#3b82f6' }}
      onClick={handleClick}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={handleRemove}
          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
          aria-label={`Remove ${tag.name} tag`}
        >
          ×
        </button>
      )}
    </span>
  );
}
