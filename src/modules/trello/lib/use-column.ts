import { useEffect, useState } from "react";
import { Card } from "../model/types";
import { columnService, Column } from "../../../api/services/column-service";
import { cardService } from "../../../api/services/card-service";
import { ApiError } from "../../../api/types/error.types";

export const useColumn = (boardId: string | undefined) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [columnSearchQueries, setColumnSearchQueries] = useState<Record<string, string>>({});
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      fetchColumns();
      fetchCards();
    } else {
      // Clear columns and cards when no board is selected
      setColumns([]);
      setCards([]);
    }
  }, [boardId]);

  const fetchColumns = async () => {
    if (!boardId) return;
    try {
      const data = await columnService.getColumns(boardId);
      setColumns(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const fetchCards = async () => {
    if (!boardId) return;
    try {
      const data = await cardService.getCards(boardId);
      setCards(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const createColumn = async (title: string) => {
    if (!boardId) return;
    try {
      const newColumn = await columnService.createColumn({
        boardId,
        title,
        order: columns.length
      });
      setColumns([...columns, newColumn]);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const updateColumn = async (id: string, title: string, order: number) => {
    try {
      const updatedColumn = await columnService.updateColumn(id, { title, order });
      setColumns(columns.map((col) => (col.id === id ? updatedColumn : col)));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      await columnService.deleteColumn(id);
      setColumns(columns.filter((col) => col.id !== id));
      // Update cards that were in this column
      setCards(
        cards.map((card) =>
          card.columnId === id ? { ...card, columnId: null } : card
        )
      );
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const createCard = async (columnId: string, title: string, description: string) => {
    if (!boardId) return;
    try {
      const newCard = await cardService.createCard({
        boardId,
        columnId,
        title,
        description,
        order: cards.filter((card) => card.columnId === columnId).length
      });
      setCards([...cards, newCard]);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const updateCard = async (
    id: string,
    title: string,
    description: string,
    columnId: string | null,
    order: number
  ) => {
    try {
      const updatedCard = await cardService.updateCard(id, {
        title,
        description,
        columnId,
        order
      });
      setCards(cards.map((card) => (card.id === id ? updatedCard : card)));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await cardService.deleteCard(id);
      setCards(cards.filter((card) => card.id !== id));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  const sortByOrder = <T extends { order: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.order - b.order);
  };

  const setColumnSearchQuery = (columnId: string, query: string) => {
    setColumnSearchQueries(prev => ({
      ...prev,
      [columnId]: query
    }));
  };

  const getColumnSearchQuery = (columnId: string) => {
    return columnSearchQueries[columnId] || "";
  };

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedColumns = sortByOrder(columns);

  const getColumnCards = (columnId: string) => {
    const columnSearch = columnSearchQueries[columnId]?.toLowerCase() || "";
    return sortByOrder(
      filteredCards.filter(
        (card) =>
          card.columnId === columnId &&
          (columnSearch === "" ||
            card.title.toLowerCase().includes(columnSearch) ||
            card.description.toLowerCase().includes(columnSearch))
      )
    );
  };

  const handleColumnDragStart = (e: React.DragEvent, column: Column) => {
    e.stopPropagation();
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedColumn && draggedColumn.id !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleColumnDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedColumn || draggedColumn.id === targetColumnId) {
      setDraggedColumn(null);
      setDragOverColumnId(null);
      return;
    }

    const sourceIndex = columns.findIndex((col) => col.id === draggedColumn.id);
    const targetIndex = columns.findIndex((col) => col.id === targetColumnId);

    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, movedColumn);

    // Update orders
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index,
    }));

    try {
      await columnService.reorderColumns(updatedColumns);
      setColumns(updatedColumns);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }

    setDraggedColumn(null);
    setDragOverColumnId(null);
  };

  const handleCardDragStart = (e: React.DragEvent, card: Card) => {
    e.stopPropagation();
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragOver = (e: React.DragEvent, cardId?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedCard) {
      if (cardId && draggedCard.id !== cardId) {
        setDragOverCardId(cardId);
      }
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleCardDrop = async (
    e: React.DragEvent,
    targetColumnId: string,
    targetCardId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedCard) {
      setDragOverCardId(null);
      return;
    }

    if (targetCardId === draggedCard.id) {
      setDragOverCardId(null);
      return;
    }

    if (targetColumnId === draggedCard.columnId && targetCardId === draggedCard.id) {
      setDragOverCardId(null);
      return;
    }

    const targetCards = cards.filter((card) => card.columnId === targetColumnId);
    let newOrder: number;

    if (targetCardId) {
      const targetCard = cards.find((card) => card.id === targetCardId);
      if (targetCard) {
        newOrder = targetCard.order;
      } else {
        newOrder = targetCards.length;
      }
    } else {
      newOrder = targetCards.length;
    }

    // Optimistically update the UI
    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => {
        if (card.id === draggedCard.id) {
          return { ...card, columnId: targetColumnId, order: newOrder };
        }
        if (
          card.columnId === targetColumnId &&
          card.order >= newOrder &&
          card.id !== draggedCard.id
        ) {
          return { ...card, order: card.order + 1 };
        }
        return card;
      });
      return updatedCards;
    });

    try {
      // First update the orders of other cards
      const cardsToUpdate = cards.filter(
        (card) =>
          card.columnId === targetColumnId &&
          card.order >= newOrder &&
          card.id !== draggedCard.id
      );
      
      if (cardsToUpdate.length > 0) {
        await cardService.reorderCards(
          cardsToUpdate.map(card => ({ ...card, order: card.order + 1, boardId: card.boardId }))
        );
      }

      // Then move the dragged card
      await cardService.moveCard(draggedCard.id, targetColumnId, newOrder);
      setError(null);
    } catch (err) {
      // Revert the optimistic update on error
      setCards((prevCards) => {
        return prevCards.map((card) => {
          if (card.id === draggedCard.id) {
            return draggedCard; // Restore original state
          }
          if (card.columnId === targetColumnId && card.order >= newOrder) {
            return { ...card, order: card.order - 1 }; // Restore original order
          }
          return card;
        });
      });

      if (err instanceof ApiError) {
        setError(err.message);
      }
    }

    setDraggedCard(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDraggedCard(null);
    setDragOverColumnId(null);
    setDragOverCardId(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    columnSearchQueries,
    setColumnSearchQuery,
    getColumnSearchQuery,
    columns,
    cards,
    draggedColumn,
    draggedCard,
    dragOverColumnId,
    dragOverCardId,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    handleCardDragStart,
    handleCardDragOver,
    handleCardDrop,
    handleDragEnd,
    getColumnCards,
    sortedColumns,
    filteredCards,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    sortByOrder,
    error
  };
};