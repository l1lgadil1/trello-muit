import axios from 'axios';
import { ApiError, NetworkError, NotFoundError } from '../types/error.types';

const API_URL = 'http://localhost:3001';

export interface Column {
  id: string;
  boardId: string;
  title: string;
  order: number;
}

export interface CreateColumnRequest {
  boardId: string;
  title: string;
  order: number;
}

export interface UpdateColumnRequest {
  title?: string;
  order?: number;
}

/**
 * Service for handling column-related API operations
 */
export const columnService = {
  /**
   * Get columns for a specific board
   */
  async getColumns(boardId: string): Promise<Column[]> {
    try {
      const response = await axios.get(`${API_URL}/columns?boardId=${boardId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError('Columns not found');
        }
      }
      throw new ApiError('Failed to fetch columns');
    }
  },

  /**
   * Create a new column
   */
  async createColumn(data: CreateColumnRequest): Promise<Column> {
    try {
      const response = await axios.post(`${API_URL}/columns`, {
        ...data,
        id: crypto.randomUUID()
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 400) {
          throw new ApiError('Invalid column data');
        }
      }
      throw new ApiError('Failed to create column');
    }
  },

  /**
   * Update an existing column
   */
  async updateColumn(id: string, data: UpdateColumnRequest): Promise<Column> {
    try {
      const response = await axios.patch(`${API_URL}/columns/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Column with ID ${id} not found`);
        }
        if (error.response.status === 400) {
          throw new ApiError('Invalid column data');
        }
      }
      throw new ApiError('Failed to update column');
    }
  },

  /**
   * Delete a column
   */
  async deleteColumn(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/columns/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Column with ID ${id} not found`);
        }
      }
      throw new ApiError('Failed to delete column');
    }
  },

  /**
   * Reorder columns by updating their order values
   */
  async reorderColumns(columns: Column[]): Promise<Column[]> {
    try {
      const updates = columns.map(column => 
        axios.patch(`${API_URL}/columns/${column.id}`, { order: column.order })
      );
      await Promise.all(updates);
      return columns;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
      }
      throw new ApiError('Failed to reorder columns');
    }
  }
}; 