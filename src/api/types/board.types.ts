/**
 * Board entity interface
 */
export interface Board {
  id: string;
  title: string;
  columns: string[]; // Array of column IDs
  createdAt: string;
  updatedAt: string;
}

/**
 * Request type for creating a new board
 */
export interface CreateBoardRequest {
  title: string;
}

/**
 * Request type for updating a board
 */
export interface UpdateBoardRequest {
  title?: string;
  columns?: string[]; // Array of column IDs
} 