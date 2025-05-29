"use client";

import { format } from "date-fns";
import { Building2, MapPin, Calendar, Flag, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminRepresentativeAddress } from "@/hooks/admin/use-admin-representative-address";

interface RepresentativeAddressModalProps {
  addressId: string | null;
  open: boolean;
  onClose: () => void;
}

export function RepresentativeAddressModal({
  addressId,
  open,
  onClose,
}: RepresentativeAddressModalProps) {
  const { data: address, isLoading } = useAdminRepresentativeAddress(addressId);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Representative Address Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : address ? (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-16 w-16">
                {address.company_logo_url ? (
                  <AvatarImage
                    src={address.company_logo_url}
                    alt={address.company_name}
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">
                    {address.company_name}
                  </h3>
                  <Badge
                    variant={address.region === "eu" ? "default" : "secondary"}
                  >
                    {address.region.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created at{" "}
                    <span className="font-bold">
                      {format(new Date(address.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <Badge
                    variant={address.is_active ? "outline" : "secondary"}
                    className={
                      address.is_active
                        ? "bg-green-50 text-green-700 border-green-200"
                        : ""
                    }
                  >
                    {address.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Company Name
                  </label>
                  <p className="text-sm">{address.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    Country
                  </label>
                  <p className="text-sm">{address.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Region
                  </label>
                  <p className="text-sm">{address.region.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div>
                    <Badge
                      variant={address.is_active ? "outline" : "secondary"}
                      className={
                        address.is_active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : ""
                      }
                    >
                      {address.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </h4>

              <p className="text-sm">{address.company_address}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Address not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
