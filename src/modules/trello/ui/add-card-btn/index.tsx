interface IProps {
  onClick: () => void;
}

export const AddCardBtn = ({ onClick }: IProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2 py-1.5 mt-2 rounded-md
        text-sm font-medium
        text-muted-foreground hover:text-primary
        hover:bg-primary/10 dark:hover:bg-primary/20
        border border-transparent
        hover:border-border/50 dark:hover:border-muted/30
        transition-all duration-200"
    >
      + Add Card
    </button>
  );
};
