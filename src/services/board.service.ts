import axios from 'axios';
import { authService } from './auth.service';

const API_URL = 'http://localhost:3001';

export interface Board {
  id: number;
  title: string;
  userId: number;
}

class BoardService {
  async getBoards(): Promise<Board[]> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const response = await axios.get(`${API_URL}/boards?userId=${currentUser.id}`);
    return response.data;
  }

  async getBoard(id: number): Promise<Board> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const response = await axios.get(`${API_URL}/boards/${id}`);
    const board = response.data;

    if (board.userId !== currentUser.id) {
      throw new Error('Unauthorized access to board');
    }

    return board;
  }

  async createBoard(title: string): Promise<Board> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const response = await axios.post(`${API_URL}/boards`, {
      title,
      userId: currentUser.id
    });
    return response.data;
  }

  async updateBoard(id: number, title: string): Promise<Board> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const board = await this.getBoard(id);
    if (board.userId !== currentUser.id) {
      throw new Error('Unauthorized to update this board');
    }

    const response = await axios.patch(`${API_URL}/boards/${id}`, {
      title
    });
    return response.data;
  }

  async deleteBoard(id: number): Promise<void> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const board = await this.getBoard(id);
    if (board.userId !== currentUser.id) {
      throw new Error('Unauthorized to delete this board');
    }

    await axios.delete(`${API_URL}/boards/${id}`);
  }
}

export const boardService = new BoardService(); 