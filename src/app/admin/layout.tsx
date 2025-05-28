"use client";

import { Loader2 } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
