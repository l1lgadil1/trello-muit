import { Board } from "../../../../api/types/board.types";

interface IProps {
  isOpen: boolean;
  isEditing: boolean;
  board?: Board;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export const BoardModal = ({ isOpen, isEditing, board, onClose, onSubmit }: IProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    if (title.trim()) {
      onSubmit(title);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Board" : "Create New Board"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Board Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={board?.title || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter board title"
              autoFocus
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Save Changes" : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 