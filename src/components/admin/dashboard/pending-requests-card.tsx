"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAdminPendingRequests } from "@/hooks/admin/use-admin-pending-requests";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Flag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

export function PendingRequestsCard() {
  const router = useRouter();
  const { data: requests, isLoading } = useAdminPendingRequests();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Pending Approval Requests</CardTitle>
        <Badge variant="outline" className="font-normal">
          {isLoading ? (
            <Skeleton className="h-4 w-6" />
          ) : (
            `${requests?.length || 0} requests`
          )}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))
        ) : requests?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending requests</p>
          </div>
        ) : (
          requests?.slice(0, 5).map((request) => (
            <div
              key={request.id}
              className="flex items-center rounded-lg border p-3 text-left text-sm transition-all hover:bg-muted"
            >
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{request.company_name}</p>
                <div className="flex items-center pt-2">
                  <Badge
                    className={cn(
                      "mr-2",
                      request.region === "eu" ? "bg-blue-500" : "bg-red-500"
                    )}
                  >
                    {request.region.toUpperCase()}
                  </Badge>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => router.push("/admin/authorized-reps")}
        >
          View All Requests
        </Button>
      </CardFooter>
    </Card>
  );
}