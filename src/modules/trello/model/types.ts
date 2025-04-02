export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Card {
  id: string;
  boardId: string;
  columnId: string | null;
  title: string;
  description: string;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface CardAssignment {
  id: string;
  cardId: string;
  userId: string;
  assignedAt: string;
}