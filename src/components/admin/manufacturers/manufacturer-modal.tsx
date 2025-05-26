"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useAdminManufacturer } from "@/hooks/admin/use-admin-manufacturer";
import { format } from "date-fns";
import Image from "next/image";

interface ManufacturerModalProps {
  manufacturerId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ManufacturerModal({
  manufacturerId,
  open,
  onClose,
}: ManufacturerModalProps) {
  const { data: manufacturer, isLoading } = useAdminManufacturer(manufacturerId);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle>Manufacturer Details</DialogTitle>
          <DialogDescription>
            View detailed information about this manufacturer
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
                  <div className="w-full md:w-1/3">
                    <Avatar className="h-32 w-32 rounded-md mx-auto md:mx-0">
                      {manufacturer?.logo_image_url ? (
                        <AvatarImage 
                          src={manufacturer.logo_image_url} 
                          alt={manufacturer.name} 
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                          <Building2 className="h-16 w-16" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-2xl font-medium">{manufacturer?.name}</h3>
                      <p className="text-muted-foreground">
                        {manufacturer?.country}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a 
                          href={`mailto:${manufacturer?.email}`}
                          className="text-primary hover:underline"
                        >
                          {manufacturer?.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{manufacturer?.phone}</span>
                      </div>
                      
                      <div className="flex items-start col-span-1 sm:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <span>{manufacturer?.address}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Registered On</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">
                            {manufacturer && format(new Date(manufacturer.created_at), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">
                            {manufacturer && format(new Date(manufacturer.updated_at), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Authorized Signatory
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Signatory Name</p>
                          <p className="font-medium">{manufacturer?.authorised_signatory_name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Position</p>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <p className="font-medium">{manufacturer?.position}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Signature</p>
                      {manufacturer?.signature_image_url ? (
                        <div className="border rounded-lg p-2 bg-white">
                          <div className="relative h-20">
                            <Image
                              src={manufacturer.signature_image_url}
                              alt="Signature"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-muted/30 text-center text-muted-foreground">
                          No signature available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Customer Information
                  </h3>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground">Customer Email</p>
                    <p className="font-medium">{manufacturer?.user?.email || "Unknown"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 pt-4">
          <Button onClick={() => onClose()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}