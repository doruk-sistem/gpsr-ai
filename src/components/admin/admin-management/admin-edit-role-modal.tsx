"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { type UserProfile } from "@/lib/services/user-service";

interface AdminEditRoleModalProps {
  userProfile: UserProfile | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (role: UserProfile["role"]) => void;
  isLoading: boolean;
}

export function AdminEditRoleModal({
  userProfile,
  open,
  onClose,
  onUpdate,
  isLoading,
}: AdminEditRoleModalProps) {
  const [role, setRole] = useState<UserProfile["role"]>(
    userProfile?.role || "user"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(role);
  };

  useEffect(() => {
    // Update local state when admin changes
    if (userProfile && userProfile.role !== role) {
      setRole(userProfile.role);
    }
  }, [userProfile, userProfile?.role]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Admin Role</DialogTitle>
          <DialogDescription>
            Update permissions for {userProfile?.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: "admin" | "superadmin") =>
                  setRole(value)
                }
              >
                <SelectTrigger id="role">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-muted p-3 rounded-md mt-2">
                <p className="text-sm font-medium mb-1">Role permissions:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {role === "superadmin" ? (
                    <>
                      <li>• Invite new administrators</li>
                      <li>• Manage admin accounts and permissions</li>
                      <li>• Full access to all system features</li>
                    </>
                  ) : (
                    <>
                      <li>• Manage GPSR compliance data</li>
                      <li>• Review and approve representative requests</li>
                      <li>• Cannot manage other administrators</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || role === userProfile?.role}
            >
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
