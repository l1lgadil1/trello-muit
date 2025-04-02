interface IProps {    
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColumnListSearch = ({ value, onChange }: IProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search in column..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm 
          bg-background text-foreground 
          placeholder:text-muted-foreground/60
          border border-border/50 hover:border-border
          dark:border-muted/30 dark:hover:border-muted
          rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary/20
          transition-all duration-200"
      />
    </div>
  );
};