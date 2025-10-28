import { CheckSquare, Search } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="p-12 text-center">
      {searchTerm ? (
        <>
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            No tasks match your search for "{searchTerm}". Try adjusting your search terms or filters.
          </p>
        </>
      ) : (
        <>
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500">
            Get started by creating your first task. Click the "Create Task" button to begin.
          </p>
        </>
      )}
    </div>
  );
}
