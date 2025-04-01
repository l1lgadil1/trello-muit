import axios from 'axios';
import { boardService } from './board.service';
import { User } from './auth.service';

const API_URL = 'http://localhost:3001';

export interface Card {
  id: number;
  title: string;
  description: string;
  columnId: number | null;
  boardId: number;
  order: number;
  assignedUsers: number[]; // Array of user IDs
}

export interface CardAssignment {
  cardId: number;
  userId: number;
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
    order: number,
    assignedUsers: number[] = []
  ): Promise<Card> {
    // This will throw if user is not authorized to access the board
    await boardService.getBoard(boardId);

    const response = await axios.post(`${API_URL}/cards`, {
      title,
      description,
      columnId,
      boardId,
      order,
      assignedUsers
    });
    return response.data;
  }

  async updateCard(
    id: number,
    title: string,
    description: string,
    columnId: number | null,
    order: number,
    assignedUsers?: number[]
  ): Promise<Card> {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    const card = response.data;

    // This will throw if user is not authorized to access the board
    await boardService.getBoard(card.boardId);

    const updateResponse = await axios.patch(`${API_URL}/cards/${id}`, {
      title,
      description,
      columnId,
      order,
      ...(assignedUsers && { assignedUsers })
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

  async assignUser(cardId: number, userId: number): Promise<Card> {
    const card = await this.getCard(cardId);
    const assignedUsers = [...(card.assignedUsers || [])];
    
    if (!assignedUsers.includes(userId)) {
      assignedUsers.push(userId);
      return this.updateCard(
        cardId,
        card.title,
        card.description,
        card.columnId,
        card.order,
        assignedUsers
      );
    }
    return card;
  }

  async unassignUser(cardId: number, userId: number): Promise<Card> {
    const card = await this.getCard(cardId);
    const assignedUsers = (card.assignedUsers || []).filter(id => id !== userId);
    
    return this.updateCard(
      cardId,
      card.title,
      card.description,
      card.columnId,
      card.order,
      assignedUsers
    );
  }

  async getCard(id: number): Promise<Card> {
    const response = await axios.get(`${API_URL}/cards/${id}`);
    return response.data;
  }

  async getAssignedUsers(cardId: number): Promise<User[]> {
    const card = await this.getCard(cardId);
    if (!card.assignedUsers || card.assignedUsers.length === 0) {
      return [];
    }

    const promises = card.assignedUsers.map(userId =>
      axios.get(`${API_URL}/users/${userId}`).then(response => {
        const { password: _, ...userWithoutPassword } = response.data;
        return userWithoutPassword;
      })
    );

    return Promise.all(promises);
  }
}

export const cardService = new CardService(); 