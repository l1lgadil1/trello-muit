import axios from 'axios';
import { ApiError, NetworkError, NotFoundError } from '../types/error.types';

const API_URL = 'http://localhost:3001';

export interface Card {
  id: string;
  boardId: string;
  columnId: string | null;
  title: string;
  description: string;
  order: number;
}

export interface CreateCardRequest {
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  order: number;
}

export interface UpdateCardRequest {
  columnId?: string | null;
  title?: string;
  description?: string;
  order?: number;
}

/**
 * Service for handling card-related API operations
 */
export const cardService = {
  /**
   * Get cards for a specific board
   */
  async getCards(boardId: string): Promise<Card[]> {
    try {
      const response = await axios.get(`${API_URL}/cards?boardId=${boardId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError('Cards not found');
        }
      }
      throw new ApiError('Failed to fetch cards');
    }
  },

  /**
   * Create a new card
   */
  async createCard(data: CreateCardRequest): Promise<Card> {
    try {
      const response = await axios.post(`${API_URL}/cards`, {
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
          throw new ApiError('Invalid card data');
        }
      }
      throw new ApiError('Failed to create card');
    }
  },

  /**
   * Update an existing card
   */
  async updateCard(id: string, data: UpdateCardRequest): Promise<Card> {
    try {
      const response = await axios.patch(`${API_URL}/cards/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Card with ID ${id} not found`);
        }
        if (error.response.status === 400) {
          throw new ApiError('Invalid card data');
        }
      }
      throw new ApiError('Failed to update card');
    }
  },

  /**
   * Delete a card
   */
  async deleteCard(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/cards/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Card with ID ${id} not found`);
        }
      }
      throw new ApiError('Failed to delete card');
    }
  },

  /**
   * Move a card to a different column and/or position
   */
  async moveCard(id: string, columnId: string | null, order: number): Promise<Card> {
    try {
      const response = await axios.patch(`${API_URL}/cards/${id}`, {
        columnId,
        order
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
        if (error.response.status === 404) {
          throw new NotFoundError(`Card with ID ${id} not found`);
        }
      }
      throw new ApiError('Failed to move card');
    }
  },

  /**
   * Reorder cards within a column
   */
  async reorderCards(cards: Card[]): Promise<Card[]> {
    try {
      const updates = cards.map(card => 
        axios.patch(`${API_URL}/cards/${card.id}`, { order: card.order })
      );
      await Promise.all(updates);
      return cards;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new NetworkError('Failed to connect to the server');
        }
      }
      throw new ApiError('Failed to reorder cards');
    }
  }
}; 