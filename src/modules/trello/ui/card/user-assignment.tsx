import { useState, useEffect } from 'react';
import { User, Card } from '../../model/types';
import { useUserAssignment } from '../../lib/use-user-assignment';

interface UserAssignmentProps {
  card: Card;
  onAssignmentChange?: () => void;
}

export const UserAssignment = ({ card, onAssignmentChange }: UserAssignmentProps) => {
  const {
    assignedUsers,
    availableUsers,
    isLoading,
    error,
    assignUser,
    unassignUser
  } = useUserAssignment(card.id);

  const [isOpen, setIsOpen] = useState(false);

  const handleAssignUser = async (userId: string) => {
    await assignUser(userId);
    onAssignmentChange?.();
  };

  const handleUnassignUser = async (userId: string) => {
    await unassignUser(userId);
    onAssignmentChange?.();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Assigned Users</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isOpen ? 'Close' : 'Manage Users'}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-2">
        {assignedUsers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {assignedUsers.map((user) => (
              <div
                key={user.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {user.name}
                {isOpen && (
                  <button
                    type="button"
                    onClick={() => handleUnassignUser(user.id)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No users assigned</p>
        )}
      </div>

      {isOpen && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Add Users</h4>
          {availableUsers.length > 0 ? (
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={(e) => handleAssignUser(e.target.value)}
              disabled={isLoading}
              defaultValue=""
            >
              <option value="" disabled>
                Select a user
              </option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-500 mt-1">No available users to assign</p>
          )}
        </div>
      )}
    </div>
  );
}; 