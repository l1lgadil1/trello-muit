import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardService } from '../api/services/board-service';
import { Board } from '../api/types/board.types';
import { ApiError } from '../api/types/error.types';

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await boardService.getBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const newBoard = await boardService.createBoard({
        title: newBoardTitle.trim()
      });
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setIsCreating(false);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Boards</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Board
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Board</h2>
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board title"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/board/${board.id}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{board.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {board.columns?.length || 0} columns
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 