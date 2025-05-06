"use client";

import React from "react";
import {
  useManufacturers,
  useDeleteManufacturer,
} from "@/hooks/use-manufacturers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Factory, PlusCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function ManufacturersPage() {
  const router = useRouter();
  const { data: manufacturers, isLoading } = useManufacturers();
  const deleteManufacturer = useDeleteManufacturer();

  const handleDelete = async (id: string) => {
    try {
      await deleteManufacturer.mutateAsync(id);
      toast.success("Manufacturer deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete manufacturer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Factory className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manufacturers</h1>
            <p className="text-muted-foreground">
              Manage your GPSR compliant manufacturers
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/manufacturers/add")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Manufacturer
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {manufacturers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                No manufacturers found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by adding your first manufacturer
              </p>
              <Button
                onClick={() => router.push("/dashboard/manufacturers/add")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Your First Manufacturer
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Logo</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturers?.map((manufacturer) => (
                    <TableRow
                      key={manufacturer.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        {manufacturer.logo_image_url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                            <Image
                              src={manufacturer.logo_image_url}
                              alt={manufacturer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border">
                            <Factory className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {manufacturer.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {manufacturer.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {manufacturer.phone}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {manufacturer.country}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/dashboard/manufacturers/${manufacturer.id}`
                              )
                            }
                            className="hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(manufacturer.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
