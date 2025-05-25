"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { isAdmin } from "@/lib/utils/admin-helpers";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoading && user) {
        const adminStatus = await isAdmin(user);
        setIsAdminUser(adminStatus);
      }
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [isLoading, user]);

  useEffect(() => {
    if (!isCheckingAdmin && !isLoading && (!user || !isAdminUser)) {
      router.push('/auth/login');
    }
  }, [isCheckingAdmin, isLoading, user, isAdminUser, router]);

  if (isLoading || isCheckingAdmin) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated and admin
  if (!user || !isAdminUser) {
    return null;
  }

  return <>{children}</>;
}