import { useState } from 'react';
import { Card as CardType } from '../api/services/card-service';
import { Column as ColumnType } from '../api/services/column-service';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isDragging: boolean;
  isOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onCardDragStart: (e: React.DragEvent, card: CardType) => void;
  onCardDragOver: (e: React.DragEvent, cardId?: string) => void;
  onCardDrop: (e: React.DragEvent, columnId: string, cardId?: string) => void;
  draggedCard: CardType | null;
  dragOverCardId: string | null;
  onUpdateColumn: (id: string, title: string, order: number) => void;
  onDeleteColumn: (id: string) => void;
  onCreateCard: (columnId: string, title: string, description: string) => void;
  onUpdateCard: (id: string, title: string, description: string, columnId: string | null, order: number) => void;
  onDeleteCard: (id: string) => void;
}

export function Column({
  column,
  cards,
  searchQuery,
  onSearchChange,
  isDragging,
  isOver,
  onDragStart,
  onDragOver,
  onDrop,
  onCardDragStart,
  onCardDragOver,
  onCardDrop,
  draggedCard,
  dragOverCardId,
  onUpdateColumn,
  onDeleteColumn,
  onCreateCard,
  onUpdateCard,
  onDeleteCard
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateColumn(column.id, title, column.order);
    setIsEditing(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCard(column.id, newCardTitle, newCardDescription);
    setNewCardTitle('');
    setNewCardDescription('');
    setIsAddingCard(false);
  };

  return (
    <div
      className={`w-80 shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg shadow ${
        isDragging ? 'opacity-50' : ''
      } ${isOver ? 'border-2 border-blue-500' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="p-3">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="mb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          </form>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{column.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cards..."
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <div className="space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`p-3 bg-white dark:bg-gray-700 rounded shadow ${
                draggedCard?.id === card.id ? 'opacity-50' : ''
              } ${dragOverCardId === card.id ? 'border-2 border-blue-500' : ''}`}
              draggable
              onDragStart={(e) => onCardDragStart(e, card)}
              onDragOver={(e) => onCardDragOver(e, card.id)}
              onDrop={(e) => onCardDrop(e, column.id, card.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white">{card.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateCard(card.id, card.title, card.description, card.columnId, card.order)}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
            </div>
          ))}
        </div>

        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="mt-3">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card title"
              className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Card description"
              className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-3 p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white border-2 border-dashed rounded"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
} 