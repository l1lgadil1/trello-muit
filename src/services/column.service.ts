import axios from 'axios';
import { boardService } from './board.service';

const API_URL = 'http://localhost:3001';

export interface Column {
  id: number;
  title: string;
  boardId: number;
  order: number;
}

class ColumnService {
  async getColumns(boardId: number): Promise<Column[]> {
    // This will throw if user is not authorized to access the board
    await boardService.getBoard(boardId);

    const response = await axios.get(`${API_URL}/columns?boardId=${boardId}&_sort=order`);
    return response.data;
  }

  async createColumn(boardId: number, title: string, order: number): Promise<Column> {
    // This will throw if user is not authorized to access the board
    await boardService.getBoard(boardId);

    const response = await axios.post(`${API_URL}/columns`, {
      title,
      boardId,
      order
    });
    return response.data;
  }

  async updateColumn(id: number, title: string, order: number): Promise<Column> {
    const response = await axios.get(`${API_URL}/columns/${id}`);
    const column = response.data;

    // This will throw if user is not authorized to access the board
    await boardService.getBoard(column.boardId);

    const updateResponse = await axios.patch(`${API_URL}/columns/${id}`, {
      title,
      order
    });
    return updateResponse.data;
  }

  async deleteColumn(id: number): Promise<void> {
    const response = await axios.get(`${API_URL}/columns/${id}`);
    const column = response.data;

    // This will throw if user is not authorized to access the board
    await boardService.getBoard(column.boardId);

    await axios.delete(`${API_URL}/columns/${id}`);
  }
}

export const columnService = new ColumnService(); 