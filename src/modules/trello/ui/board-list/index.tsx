import { Board } from "../../../../api/types/board.types";

interface IProps {
  boards: Board[];
  activeBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  onSelectBoard: (id: string) => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (id: string) => void;
  onCreateBoard: () => void;
}

export const BoardList = ({
  boards,
  activeBoard,
  isLoading,
  error,
  onSelectBoard,
  onEditBoard,
  onDeleteBoard,
  onCreateBoard,
}: IProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading boards...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <button
          onClick={onCreateBoard}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Board
        </button>
      </div>
      <div className="space-y-2">
        {boards.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No boards found. Create one to get started!
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                activeBoard?.id === board.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <button
                onClick={() => onSelectBoard(board.id)}
                className="flex-grow text-left font-medium"
              >
                {board.title}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditBoard(board)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteBoard(board.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 