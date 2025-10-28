import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TasksHeaderProps {
  onCreateTask: () => void;
}

export function TasksHeader({ onCreateTask }: TasksHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="w-7 h-7 mr-3 text-indigo-600" />
            Tasks
          </h1>
          <p className="mt-2 text-sm text-gray-600">Manage and track your team's tasks</p>
        </div>
        <Button onClick={onCreateTask} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
    </div>
  );
}
