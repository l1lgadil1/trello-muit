import axios from 'axios';
import { boardService } from './board.service';

const API_URL = 'http://localhost:3001';

export interface Card {
  id: number;
  title: string;
  description: string;
  columnId: number | null;
  boardId: number;
  order: number;
}

class CardService {
  async getCards(boardId: number): Promise<Card[]> {
    // This will throw if user is not authorized to access the board
    await boardService.getBoard(boardId);

    const response = await axios.get(`${API_URL}/cards?boardId=${boardId}&_sort=order`);
    return response.data;
  }

  async createCard(
    boardId: number,
    columnId: number | null,
    title: string,
    description: string,
    order: number
  ): Promise<Card> {
    // This will throw if user is not authorized to access the board
    await boardService.getBoard(boardId);

    const response = await axios.post(`${API_URL}/cards`, {
      title,
      description,
      columnId,
      boardId,
      order
    });
    return response.data;
  }

  async updateCard(
    id: number,
    title: string,
    description: string,
    columnId: number | null,
    order: number
  ): Promise<Card> {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    const card = response.data;

    // This will throw if user is not authorized to access the board
    await boardService.getBoard(card.boardId);

    const updateResponse = await axios.patch(`${API_URL}/cards/${id}`, {
      title,
      description,
      columnId,
      order
    });
    return updateResponse.data;
  }

  async deleteCard(id: number): Promise<void> {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    const card = response.data;

    // This will throw if user is not authorized to access the board
    await boardService.getBoard(card.boardId);

    await axios.delete(`${API_URL}/cards/${id}`);
  }
}

export const cardService = new CardService(); 