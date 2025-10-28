import { BarChart3, CheckSquare, Clock, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllTaskStats } from "../services";

export function TaskStats() {
  const { data: statsData, isLoading } = useAllTaskStats();

  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  };
  const statItems = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
            <div className={`p-2 rounded-full ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            {stats.total > 0 && (
              <p className="text-xs text-gray-500 mt-1">{((item.value / stats.total) * 100).toFixed(1)}% of total</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
