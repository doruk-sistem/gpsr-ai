"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { AdminInviteModal } from "@/components/admin/admin-management/admin-invite-modal";
import { AdminTable } from "@/components/admin/admin-management/admin-table";
import { useAdminManagement } from "@/hooks/admin/use-admin-management";
import { isSuperAdmin } from "@/lib/utils/admin-helpers";
import { useCurrentUser } from "@/hooks/use-auth";
import { Search, UserPlus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminManagementPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { 
    data: admins, 
    isLoading, 
    refetch 
  } = useAdminManagement({ search: searchQuery });

  // Check if current user is superadmin
  useEffect(() => {
    const checkSuperadminStatus = async () => {
      const superadmin = await isSuperAdmin(currentUser);
      setIsSuperAdminUser(superadmin);
      
      // If not superadmin, show toast and redirect
      if (!superadmin) {
        toast.error("Access denied", { 
          description: "You need superadmin permissions to access this page"
        });
      }
    };
    
    if (currentUser) {
      checkSuperadminStatus();
    }
  }, [currentUser]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Admin Management", href: "/admin/admin-management" }
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
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              {isSuperAdminUser && (
                <Button onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Admin
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <AdminTable 
            admins={admins || []} 
            isLoading={isLoading} 
            currentUserId={currentUser?.id}
            isSuperAdmin={isSuperAdminUser}
          />
        </CardContent>
      </Card>
      
      <AdminInviteModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}