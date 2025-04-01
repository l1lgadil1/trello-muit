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