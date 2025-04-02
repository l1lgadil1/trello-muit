interface IProps {
  actions:React.ReactNode;
  sortedColumns:React.ReactNode;
  unassignedColumn:React.ReactNode;
  columnModal:React.ReactNode;
  cardModal:React.ReactNode;
}

export const TrelloLayout = ({ actions, sortedColumns, unassignedColumn, columnModal, cardModal }: IProps) => {
  return (
    <div className="min-h-screen bg-background/95 dark:bg-background p-8">
      <div className="mb-8">
        {/* TOP */}
        {actions}
        {/* TOP */}
        <div className="flex gap-4 overflow-x-auto pb-4
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-muted/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-muted/60
          dark:[&::-webkit-scrollbar-track]:bg-muted/10
          dark:[&::-webkit-scrollbar-thumb]:bg-muted/40
          hover:[&::-webkit-scrollbar-thumb]:bg-muted/80
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-muted/60">
          {sortedColumns}
          {/* Unassigned Cards */}
          {unassignedColumn}
        </div>
        {/* Modals */}
        {columnModal}
        {cardModal}
      </div>
    </div>
  );
};