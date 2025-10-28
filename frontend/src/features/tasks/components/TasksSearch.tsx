import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskStatus } from "@/types/app.type";
import { useDebounce } from "@/hooks/useDebounce";

interface TasksSearchProps {
  // Display data
  filteredCount: number;
  totalCount: number;
}

export function TasksSearch({ filteredCount, totalCount }: TasksSearchProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/_autherized/tasks" });

  // Get current filter values from URL search params
  const searchTerm = searchParams.search || "";
  const statusFilter: TaskStatus | "all" = searchParams.status || "all";
  const sortBy = searchParams.sortBy || "createdAt";
  const sortOrder: "asc" | "desc" = searchParams.sortOrder || "desc";

  // Local search state for debouncing
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  // Update local search term when URL changes (e.g., from browser navigation)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Handle debounced search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      navigate({
        to: "/tasks",
        search: { ...searchParams, search: debouncedSearchTerm || undefined, page: undefined },
      });
    }
  }, [debouncedSearchTerm, searchTerm, navigate, searchParams]);

  // Filter change handlers
  const handleStatusFilterChange = (status: TaskStatus | "all") => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, status: status !== "all" ? status : undefined, page: undefined },
    });
  };

  const handleSortByChange = (sortBy: string) => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, sortBy, page: undefined },
    });
  };

  const handleSortOrderChange = (sortOrder: "asc" | "desc") => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, sortOrder, page: undefined },
    });
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col gap-4">
        {/* Search and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks by title or description..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredCount} of {totalCount} tasks
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created</SelectItem>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Order:</label>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
