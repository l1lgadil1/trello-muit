interface IProps {    
  header: React.ReactNode;
  search: React.ReactNode;
  list: React.ReactNode;
  isDragged?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const Column = ({ header, search, list, isDragged, onDragStart, onDragOver, onDrop, onDragEnd }: IProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e)}
      onDragEnd={onDragEnd}
      className={`
        bg-card text-card-foreground
        rounded-lg p-4 min-w-[300px]
        shadow-sm hover:shadow-md
        dark:shadow-lg dark:shadow-primary/5
        dark:hover:shadow-xl dark:hover:shadow-primary/10
        transition-all duration-200
        ${isDragged 
          ? "border-2 border-primary ring-2 ring-primary/20" 
          : "border border-border/40 hover:border-border"
        }
      `}
    >
      {header}
      {search}
      {list}
    </div>
  );
};
