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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
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
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manufacturers</CardTitle>
        <Button
          onClick={() => router.push("/dashboard/manufacturers/add")}
          className="bg-primary hover:bg-primary/90"
        >
          Add New Manufacturer
        </Button>
      </CardHeader>
      <CardContent>
        {manufacturers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-base">No manufacturers found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturers?.map((manufacturer) => (
                <TableRow key={manufacturer.id}>
                  <TableCell>
                    {manufacturer.logo_image_url ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={manufacturer.logo_image_url}
                          alt={manufacturer.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No logo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {manufacturer.name}
                  </TableCell>
                  <TableCell>{manufacturer.email}</TableCell>
                  <TableCell>{manufacturer.phone}</TableCell>
                  <TableCell>{manufacturer.country}</TableCell>
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
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(manufacturer.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
