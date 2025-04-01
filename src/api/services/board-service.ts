import axios from 'axios';
import { ApiError, NetworkError, NotFoundError } from '../types/error.types';
import { Board, CreateBoardRequest } from '../types/board.types';

const API_URL = 'http://localhost:3001';

/**
 * Service for handling board-related API operations
 */
export const boardService = {
  /**
   * Get all boards
   */
  async getBoards(): Promise<Board[]> {
    try {
      const response = await axios.get(`${API_URL}/boards`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError('Boards not found');
        }
      }
      throw new ApiError('Failed to fetch boards');
    }
  },

  /**
   * Get a board by ID
   */
  async getBoard(id: string): Promise<Board> {
    try {
      const response = await axios.get(`${API_URL}/boards/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Board with ID ${id} not found`);
        }
      }
      throw new ApiError('Failed to fetch board');
    }
  },

  /**
   * Create a new board
   */
  async createBoard(data: CreateBoardRequest): Promise<Board> {
    try {
      const response = await axios.post(`${API_URL}/boards`, {
        ...data,
        id: crypto.randomUUID(),
        columns: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 400) {
          throw new ApiError('Invalid board data');
        }
      }
      throw new ApiError('Failed to create board');
    }
  },

  /**
   * Update a board
   */
  async updateBoard(id: string, data: Partial<Board>): Promise<Board> {
    try {
      const response = await axios.patch(`${API_URL}/boards/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Board with ID ${id} not found`);
        }
        if (error.response.status === 400) {
          throw new ApiError('Invalid board data');
        }
      }
      throw new ApiError('Failed to update board');
    }
  },

  /**
   * Delete a board
   */
  async deleteBoard(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/boards/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Board with ID ${id} not found`);
        }
      }
      throw new ApiError('Failed to delete board');
    }
  }
}; 