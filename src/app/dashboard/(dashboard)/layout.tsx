// src/app/dashboard/(dashboard)/layout.tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import TrialExpirationModal from "@/components/dashboard/trial-expiration-modal";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isRootPath = pathname === "/dashboard";

  return (
    <div className="h-screen flex">
      <div className="hidden md:flex w-72">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        <main className="flex-grow py-8 bg-muted/30 overflow-y-auto">
          <div className="container mx-auto space-y-4">
            {!isRootPath && (
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Go Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <div>{children}</div>
          </div>
        </main>

        {/* Trial Expiration Modal */}
        <TrialExpirationModal />
      </div>
    </div>
  );
}
