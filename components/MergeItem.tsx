"use client";

interface MergeItemProps {
  name: string;
  index: number;
  onRemove: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

export function MergeItem({
  name,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragging,
}: MergeItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-2.5 rounded-md border border-border-default bg-accent-bg px-3 py-2.5 text-[0.85rem] text-text-primary cursor-grab transition-all duration-200 hover:border-accent-warm hover:translate-x-0.5 active:cursor-grabbing animate-[slide-in_0.25s_cubic-bezier(0,0,0.2,1)] ${
        dragging ? "opacity-50 scale-[1.02]" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <span className="text-text-muted text-base transition-colors duration-200 group-hover:text-accent-warm select-none">
        ⋮⋮
      </span>
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {name}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="bg-transparent border-none text-text-muted cursor-pointer text-lg px-1 rounded transition-all duration-200 hover:text-error hover:bg-error-bg"
      >
        &times;
      </button>
    </div>
  );
}
