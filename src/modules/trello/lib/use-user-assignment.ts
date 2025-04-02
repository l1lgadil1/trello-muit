import { useState, useEffect } from 'react';
import { User } from '../model/types';

interface Assignment {
  id: string;
  cardId: string;
  userId: string;
  user: User;
  assignedAt: string;
}

interface UseUserAssignmentResult {
  assignedUsers: User[];
  availableUsers: User[];
  isLoading: boolean;
  error: string;
  assignUser: (userId: string) => Promise<void>;
  unassignUser: (userId: string) => Promise<void>;
}

export const useUserAssignment = (cardId: string): UseUserAssignmentResult => {
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAssignedUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/cardAssignments?cardId=${cardId}&_expand=user`);
      if (!response.ok) throw new Error('Failed to fetch assigned users');
      const assignments: Assignment[] = await response.json();
      setAssignedUsers(assignments.map(assignment => assignment.user));
    } catch (err) {
      console.error('Error fetching assigned users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assigned users');
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) throw new Error('Failed to fetch available users');
      const users: User[] = await response.json();
      const assignedUserIds = new Set(assignedUsers.map(user => user.id));
      setAvailableUsers(users.filter(user => !assignedUserIds.has(user.id)));
    } catch (err) {
      console.error('Error fetching available users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch available users');
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        await Promise.all([fetchAssignedUsers(), fetchAvailableUsers()]);
      } catch (err) {
        console.error('Error loading users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [cardId]);

  const assignUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('http://localhost:3001/cardAssignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `assignment-${Date.now()}`,
          cardId,
          userId,
          assignedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to assign user');

      await Promise.all([fetchAssignedUsers(), fetchAvailableUsers()]);
    } catch (err) {
      console.error('Error assigning user:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unassignUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3001/cardAssignments?cardId=${cardId}&userId=${userId}`);
      if (!response.ok) throw new Error('Failed to find assignment');
      
      const assignments = await response.json();
      if (assignments.length === 0) throw new Error('Assignment not found');

      const deleteResponse = await fetch(`http://localhost:3001/cardAssignments/${assignments[0].id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) throw new Error('Failed to unassign user');

      await Promise.all([fetchAssignedUsers(), fetchAvailableUsers()]);
    } catch (err) {
      console.error('Error unassigning user:', err);
      setError(err instanceof Error ? err.message : 'Failed to unassign user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignedUsers,
    availableUsers,
    isLoading,
    error,
    assignUser,
    unassignUser,
  };
}; 