"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreHorizontal, 
  ShieldAlert,
  User,
  CalendarClock,
  Mail,
  Shield,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminEditRoleModal } from "@/components/admin/admin-management/admin-edit-role-modal";
import { useUpdateAdminRole, useRemoveAdmin } from "@/hooks/admin/use-admin-management";
import { toast } from "sonner";

interface Admin {
  id: string;
  user_id: string;
  role: 'admin' | 'superadmin';
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    user_metadata: {
      first_name?: string;
      last_name?: string;
    }
  }
}

interface AdminTableProps {
  admins: Admin[];
  isLoading: boolean;
  currentUserId?: string;
  isSuperAdmin: boolean;
}

export function AdminTable({
  admins,
  isLoading,
  currentUserId,
  isSuperAdmin
}: AdminTableProps) {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  
  const updateAdminRole = useUpdateAdminRole();
  const removeAdmin = useRemoveAdmin();

  const handleRoleUpdate = async (role: 'admin' | 'superadmin') => {
    if (!selectedAdmin) return;
    
    try {
      await updateAdminRole.mutateAsync({ 
        adminId: selectedAdmin.id, 
        role 
      });
      
      toast.success(`Role updated successfully`, {
        description: `${selectedAdmin.user.email} is now a ${role}`
      });
      
      setIsEditRoleModalOpen(false);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedAdmin) return;
    
    try {
      await removeAdmin.mutateAsync({ adminId: selectedAdmin.id });
      
      toast.success(`Admin removed successfully`, {
        description: `${selectedAdmin.user.email} is no longer an admin`
      });
      
      setIsRemoveDialogOpen(false);
    } catch (error) {
      toast.error("Failed to remove admin");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No admin accounts found
                </TableCell>
              </TableRow>
            ) : (
              admins?.map((admin) => (
                <TableRow key={admin.id} className={admin.role === 'superadmin' ? "bg-muted/30" : ""}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={admin.role === 'superadmin' ? "bg-primary/20 text-primary" : "bg-muted"}>
                        {admin.role === 'superadmin' ? (
                          <ShieldAlert className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {admin.user?.user_metadata?.first_name || ''} {admin.user?.user_metadata?.last_name || ''}
                      {admin.user_id === currentUserId && (
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">You</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{admin.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'superadmin' ? "default" : "outline"} className={admin.role === 'admin' ? "bg-muted" : ""}>
                      <Shield className="h-3 w-3 mr-1" />
                      {admin.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{format(new Date(admin.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isSuperAdmin && admin.user_id !== currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            setSelectedAdmin(admin);
                            setIsEditRoleModalOpen(true);
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsRemoveDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Role Modal */}
      <AdminEditRoleModal
        open={isEditRoleModalOpen}
        onClose={() => setIsEditRoleModalOpen(false)}
        admin={selectedAdmin}
        onUpdate={handleRoleUpdate}
        isLoading={updateAdminRole.isPending}
      />
      
      {/* Remove Admin Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove admin access for {selectedAdmin?.user.email}.
              Their account will remain active, but they will no longer have administrator privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveAdmin}
              className="bg-destructive text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}