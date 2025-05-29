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
  CalendarClock,
  Mail,
  Shield,
  Trash2,
  Search,
  RefreshCw,
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
import { useRemoveAdmin } from "@/hooks/admin/use-admin-management";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { type UserProfile } from "@/lib/services/user-service";
import { useGetUserProfiles, useUpdateUserProfile } from "@/hooks/use-users";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface AdminTableProps {
  currentUserId?: string;
}

export function AdminTable({ currentUserId }: AdminTableProps) {
  const [selectedUserProfile, setSelectedUserProfile] =
    useState<UserProfile | null>(null);

  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const pageSize = 10;

  const {
    data: userProfilesData,
    isLoading,
    refetch,
  } = useGetUserProfiles({
    search: debouncedSearchQuery,
    role: ["admin", "superadmin"],
    pageSize,
    page: currentPage,
  });

  const updateUserProfile = useUpdateUserProfile();
  const removeAdmin = useRemoveAdmin();

  const userProfiles = userProfilesData?.data;
  const totalItems = userProfilesData?.count || 0;

  const handleRoleUpdate = async (role: UserProfile["role"]) => {
    if (!selectedUserProfile) return;

    try {
      await updateUserProfile.mutateAsync({
        userId: selectedUserProfile.id,
        userProfileData: { role },
      });

      toast.success(`Role updated successfully`, {
        description: `${selectedUserProfile.email} is now a ${role}`,
      });

      setIsEditRoleModalOpen(false);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedUserProfile) return;

    try {
      await removeAdmin.mutateAsync({ adminId: selectedUserProfile.id });

      toast.success(`Admin removed successfully`, {
        description: `${selectedUserProfile.email} is no longer an admin`,
      });

      setIsRemoveDialogOpen(false);
    } catch (error) {
      toast.error("Failed to remove admin");
    }
  };

  return (
    <>
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

        <div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    <span className="sr-only"></span>{" "}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProfiles?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No user accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  userProfiles?.map((userProfile) => (
                    <TableRow
                      key={userProfile.id}
                      className={
                        userProfile.role === "superadmin" ? "bg-muted/30" : ""
                      }
                    >
                      <TableCell>
                        <div className="font-medium">
                          {userProfile.first_name || ""}{" "}
                          {userProfile.last_name || ""}
                          {userProfile.id === currentUserId && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-primary/10 text-primary"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{userProfile.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            userProfile.role === "superadmin"
                              ? "default"
                              : "outline"
                          }
                          className={
                            userProfile.role === "admin" ? "bg-muted" : ""
                          }
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {userProfile.role === "superadmin"
                            ? "Superadmin"
                            : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>
                            {format(
                              new Date(userProfile.created_at),
                              "MMM d, yyyy"
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {userProfile.id !== currentUserId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUserProfile(userProfile);
                                  setIsEditRoleModalOpen(true);
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedUserProfile(userProfile);
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

          {/* Pagination */}
          <DataTablePagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Edit Role Modal */}
      <AdminEditRoleModal
        open={isEditRoleModalOpen}
        onClose={() => setIsEditRoleModalOpen(false)}
        userProfile={selectedUserProfile}
        onUpdate={handleRoleUpdate}
        isLoading={updateUserProfile.isPending}
      />

      {/* Remove Admin Dialog */}
      <AlertDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove admin access for{" "}
              {selectedUserProfile?.email}. Their account will remain active,
              but they will no longer have administrator privileges.
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
