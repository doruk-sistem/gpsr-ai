"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, LogOut } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTrialStatus } from "@/hooks/use-stripe";
import { useCurrentUser } from "@/hooks/use-auth";
import { LogoutConfirmation } from "../logout-confirmation/logout-confirmation";

export default function DashboardNavbar() {
  const router = useRouter();
  const { data: trialStatus } = useTrialStatus();
  const { data: user } = useCurrentUser();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Trial indicator */}
        {trialStatus?.isTrialing && (
          <div className="mr-auto flex items-center">
            <div
              className={`flex items-center py-1 px-3 text-sm rounded-full border 
                ${
                  trialStatus?.daysRemaining <= 2
                    ? "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-primary/10 text-primary border-primary/30"
                }`}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {trialStatus?.daysRemaining === 0
                  ? "Trial ends today"
                  : `${trialStatus?.daysRemaining} day${
                      trialStatus?.daysRemaining !== 1 ? "s" : ""
                    } left in trial`}
              </span>
              <Button
                variant="link"
                onClick={() => router.push("/dashboard/billing")}
                className="ml-1 p-0 h-auto text-xs underline"
              >
                Manage
              </Button>
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <User className="h-5 w-5 mr-2" />
                {`${user?.user_metadata?.first_name} ${
                  user?.user_metadata?.last_name || ""
                }`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.user_metadata?.first_name
                  ? `${user.user_metadata.first_name} ${
                      user.user_metadata.last_name || ""
                    }`
                  : user?.email || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/billing")}
              >
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Shared Logout Confirmation Component */}
      <LogoutConfirmation
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </div>
  );
}
