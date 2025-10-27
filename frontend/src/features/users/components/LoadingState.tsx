import { Users, Loader2 } from "lucide-react";

export function LoadingState() {
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
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    </div>
  );
}
