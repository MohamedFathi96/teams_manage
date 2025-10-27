import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UsersSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function UsersSearch({ searchTerm, onSearchChange, filteredCount, totalCount }: UsersSearchProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredCount} of {totalCount} users
        </div>
      </div>
    </div>
  );
}
