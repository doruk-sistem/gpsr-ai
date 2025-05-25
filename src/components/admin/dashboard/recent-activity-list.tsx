"use client";

import { useAdminActivityLog } from "@/hooks/admin/use-admin-activity-log";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

export function RecentActivityList() {
  const { data: activities, isLoading } = useAdminActivityLog();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return "🔐";
      case "rep_request":
        return "🔄";
      case "product":
        return "📦";
      case "user":
        return "👤";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))
      ) : activities?.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No recent activities
        </p>
      ) : (
        activities?.map((activity) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-4 rounded-lg transition-all",
              activity.is_important && "bg-muted/50 p-3 -mx-3"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getActivityIcon(activity.activity_type)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 flex-1">
              <p
                className={cn(
                  "text-sm",
                  activity.is_important && "font-medium"
                )}
                dangerouslySetInnerHTML={{ __html: activity.message }}
              />
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}