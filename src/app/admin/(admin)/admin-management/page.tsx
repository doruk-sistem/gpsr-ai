"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { AdminInviteModal } from "@/components/admin/admin-management/admin-invite-modal";
import { AdminTable } from "@/components/admin/admin-management/admin-table";
import { useCurrentUser } from "@/hooks/use-auth";
import { UserPlus } from "lucide-react";

export default function AdminManagementPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Admin Management", href: "/admin/admin-management" },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>
                Manage administrator accounts and permissions
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Admin
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AdminTable currentUserId={currentUser?.id} />
        </CardContent>
      </Card>

      <AdminInviteModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
