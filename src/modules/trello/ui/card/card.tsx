import { Card as CardType } from '../../model/types';
import { useUserAssignment } from '../../lib/use-user-assignment';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
  isDragging?: boolean;
}

export const Card = ({ card, onEdit, onDelete, isDragging }: CardProps) => {
  const { assignedUsers, isLoading } = useUserAssignment(card.id);

  return (
    <div
      className={`
        group relative rounded-lg p-4
        bg-card text-card-foreground
        dark:bg-gradient-to-b dark:from-card dark:to-card/90
        border border-border/50 dark:border-border/10
        shadow-sm hover:shadow-md
        dark:shadow-lg dark:shadow-primary/5
        dark:hover:shadow-xl dark:hover:shadow-primary/10
        hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 ease-in-out
        ${isDragging ? 'opacity-50 rotate-2' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-foreground dark:text-foreground/90">{card.title}</h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(card)}
            className="p-1 rounded-md
              text-muted-foreground hover:text-primary
              hover:bg-primary/10 dark:hover:bg-primary/20
              transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 rounded-md
              text-muted-foreground hover:text-destructive
              hover:bg-destructive/10 dark:hover:bg-destructive/20
              transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {card.description && (
        <p className="mt-2 text-sm text-muted-foreground/80 dark:text-muted-foreground/60">{card.description}</p>
      )}

      <div className="mt-3">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-muted/30 dark:bg-muted/20 rounded-full animate-pulse"></div>
            <div className="h-6 w-6 bg-muted/30 dark:bg-muted/20 rounded-full animate-pulse"></div>
          </div>
        ) : assignedUsers.length > 0 ? (
          <div className="flex -space-x-2 overflow-hidden">
            {assignedUsers.map((user) => (
              <div
                key={user.id}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full 
                  bg-primary text-xs font-medium text-primary-foreground 
                  ring-2 ring-background dark:ring-card
                  transition-transform hover:scale-110 hover:z-10
                  dark:shadow-lg dark:shadow-primary/20"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/50">No assignees</div>
        )}
      </div>
    </div>
  );
}; 