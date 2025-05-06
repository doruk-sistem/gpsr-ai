"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Package,
  Factory,
  UserCheck,
  Receipt,
  CreditCard,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { TrialNotification } from "@/components/dashboard/trial-notification";
import { useState } from "react";
import { LogoutConfirmation } from "./logout-confirmation/logout-confirmation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Products",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    label: "Manufacturers",
    icon: Factory,
    href: "/dashboard/manufacturers",
  },
  {
    label: "Authorised Representative",
    icon: UserCheck,
    href: "/dashboard/representative",
  },
  {
    label: "Billing Plan",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    label: "Invoices",
    icon: Receipt,
    href: "/dashboard/invoices",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-gray-950 border-r border-border dark:border-gray-800">
      <div className="px-3 py-2">
        <Link href="/dashboard">
          <div className="flex items-center pl-3 mb-14">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">DorukWell</span>
            </div>
          </div>
        </Link>

        {/* Trial Notification Component */}
        <TrialNotification />

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                pathname === route.href
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    pathname === route.href
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <hr className="my-4" />
      <div className="mt-auto px-3 py-2">
        <Link
          href="/dashboard/profile"
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center flex-1">
            <User className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Account
          </div>
        </Link>

        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Log out
          </div>
        </button>
      </div>

      {/* Shared Logout Confirmation Component */}
      <LogoutConfirmation
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </div>
  );
}
