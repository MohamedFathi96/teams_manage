import { Users } from "lucide-react";

export function UsersHeader() {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Users className="w-7 h-7 mr-3 text-indigo-600" />
        Users
      </h1>
      <p className="mt-2 text-sm text-gray-600">Find and connect with other users</p>
    </div>
  );
}
