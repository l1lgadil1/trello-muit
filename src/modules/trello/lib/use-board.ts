import { useState, useEffect, useMemo } from 'react';
import { boardService } from '../../../api/services/board-service';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../../../api/types/board.types';
import { ApiError } from '../../../api/types/error.types';

export const useBoard = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const memoizedActiveBoard = useMemo(() => activeBoard, [activeBoard]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const data = await boardService.getBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createBoard = async (title: string) => {
    setIsLoading(true);
    try {
      const newBoard = await boardService.createBoard({ title });
      setBoards([...boards, newBoard]);
      setError(null);
      return newBoard;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateBoard = async (id: string, data: UpdateBoardRequest) => {
    setIsLoading(true);
    try {
      const updatedBoard = await boardService.updateBoard(id, data);
      setBoards(boards.map(board => board.id === id ? updatedBoard : board));
      if (activeBoard?.id === id) {
        setActiveBoard(updatedBoard);
      }
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBoard = async (id: string) => {
    setIsLoading(true);
    try {
      await boardService.deleteBoard(id);
      setBoards(boards.filter(board => board.id !== id));
      if (activeBoard?.id === id) {
        setActiveBoard(null);
      }
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectBoard = async (id: string) => {
    setIsLoading(true);
    try {
      const board = await boardService.getBoard(id);
      setActiveBoard(board);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    boards,
    activeBoard: memoizedActiveBoard,
    error,
    isLoading,
    createBoard,
    updateBoard,
    deleteBoard,
    selectBoard
  };
}; 