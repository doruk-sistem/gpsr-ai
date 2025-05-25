"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard, 
  UserCheck, 
  Package2, 
  Building2, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/use-auth';
import { isSuperAdmin } from '@/lib/utils/admin-helpers';

interface AdminSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const [hasSuperAdminAccess, setHasSuperAdminAccess] = useState(false);

  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (user) {
        const isSuperAdminUser = await isSuperAdmin(user);
        setHasSuperAdminAccess(isSuperAdminUser);
      }
    };
    
    checkSuperAdminStatus();
  }, [user]);

  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard',
    },
    {
      label: 'Authorized Reps',
      icon: UserCheck,
      href: '/admin/authorized-reps',
      active: pathname === '/admin/authorized-reps',
    },
    {
      label: 'Product Applications',
      icon: Package2,
      href: '/admin/product-applications',
      active: pathname === '/admin/product-applications',
    },
    {
      label: 'Manufacturers',
      icon: Building2,
      href: '/admin/manufacturers',
      active: pathname === '/admin/manufacturers',
    },
    {
      label: 'Customers',
      icon: Users,
      href: '/admin/customers',
      active: pathname === '/admin/customers',
    },
    {
      label: 'Admin Management',
      icon: Users2,
      href: '/admin/admin-management',
      active: pathname === '/admin/admin-management',
      requiresSuperAdmin: true,
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      active: pathname === '/admin/settings',
    },
  ];

  const filteredRoutes = routes.filter(route => 
    !route.requiresSuperAdmin || hasSuperAdminAccess
  );

  return (
    <div
      className={cn(
        "relative border-r bg-background z-30 h-screen flex-col transition-all duration-300",
        open ? "flex w-64" : "flex w-16"
      )}
    >
      <div className="px-3 py-4 flex-1 h-full flex flex-col">
        <Link href="/admin/dashboard" className="flex items-center py-3 px-2 mb-8">
          {open ? (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          ) : (
            <Shield className="h-6 w-6 text-primary mx-auto" />
          )}
        </Link>

        <ScrollArea className="flex-1 px-1">
          <nav className="flex flex-col gap-1">
            <TooltipProvider delayDuration={0}>
              {filteredRoutes.map((route) => (
                <Tooltip key={route.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center rounded-md p-2 text-muted-foreground transition-all hover:bg-muted",
                        route.active && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <route.icon className={cn(
                        "h-5 w-5",
                        open ? "mr-2" : "mx-auto"
                      )} />
                      {open && <span>{route.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!open && (
                    <TooltipContent side="right">
                      {route.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </ScrollArea>
      </div>

      <button
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground"
        onClick={() => onOpenChange(!open)}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}