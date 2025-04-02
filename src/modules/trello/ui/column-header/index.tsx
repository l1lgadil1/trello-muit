import { DragHandle } from "../drag-handle";

interface IProps {    
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
} 

export const ColumnHeader = ({ title, onEdit, onDelete }: IProps) => {
  return (
    <div className="flex justify-between items-center mb-4 group">
      <div className="flex items-center gap-2">
        {onEdit && onDelete && (
          <div className="cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity">
            <DragHandle />
          </div>
        )}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-2 py-1 rounded-md text-sm
              text-muted-foreground hover:text-primary
              hover:bg-primary/10 dark:hover:bg-primary/20
              transition-colors"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-2 py-1 rounded-md text-sm
              text-destructive/80 hover:text-destructive
              hover:bg-destructive/10 dark:hover:bg-destructive/20
              transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
