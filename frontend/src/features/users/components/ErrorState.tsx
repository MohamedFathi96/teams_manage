import { Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="w-7 h-7 mr-3 text-indigo-600" />
          Users
        </h1>
        <p className="mt-2 text-sm text-gray-600">Find and connect with other users</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load users</h3>
          <p className="text-gray-500 mb-4">There was an error loading the users list.</p>
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
