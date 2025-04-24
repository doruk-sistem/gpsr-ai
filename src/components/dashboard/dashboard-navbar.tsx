import React from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardNavbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />

          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <User className="h-4 w-4" />
            <span>Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
