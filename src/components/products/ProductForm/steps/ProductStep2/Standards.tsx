import React, { useState } from "react";
import { FileText, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UserProductUserStandard } from "@/lib/services/user-product-user-standards-service";

import {
  useAddUserProductUserStandard,
  useDeleteUserProductUserStandard,
} from "@/hooks/use-user-product-user-standards";

import { useProductForm } from "../../hooks/useProductForm";

export default function Standards() {
  const { initialData, setInitialData } = useProductForm();

  const deleteStandard = useDeleteUserProductUserStandard();
  const addStandard = useAddUserProductUserStandard();

  const [standards, setStandards] = useState<UserProductUserStandard[]>(
    initialData?.selectedStandards || []
  );

  const [newStandard, setNewStandard] = useState<{
    ref_no: string;
    edition_date: string;
    title: string;
  }>({
    ref_no: "",
    edition_date: "",
    title: "",
  });

  const handleRemoveStandard = async (standardId: string) => {
    try {
      await deleteStandard.mutateAsync(standardId);

      setStandards(standards.filter((s) => s.id !== standardId));

      toast.success("Standard removed successfully");
    } catch (error) {
      console.error("Error removing standard:", error);
      toast.error("Failed to remove standard");
    }
  };

  const handleChangeStandard = (
    field: keyof typeof newStandard,
    value: string
  ) => {
    setNewStandard({ ...newStandard, [field]: value });
  };

  const handleAddStandard = async () => {
    if (
      !newStandard.ref_no ||
      !newStandard.edition_date ||
      !newStandard.title
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const addedStandard = await addStandard.mutateAsync({
        ref_no: newStandard.ref_no,
        edition_date: newStandard.edition_date,
        title: newStandard.title,
        user_product_id: initialData?.id || "",
      });

      setStandards([...standards, addedStandard]);

      setNewStandard({
        ref_no: "",
        edition_date: "",
        title: "",
      });

      setInitialData({
        ...initialData,
        selectedStandards: [...standards, addedStandard],
      });

      toast.success("Standard added successfully");
    } catch (error) {
      console.error("Error adding standard:", error);
      toast.error("Failed to add standard");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Standards</h3>
      </div>

      <div className="space-y-4">
        {standards.length > 0 && (
          <div className="space-y-4">
            {standards.map((standard) => (
              <div key={standard.id} className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={standard.ref_no}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Edition/Date</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={standard.edition_date || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <Label>Title</Label>
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={standard.title}
                      disabled
                      className="bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveStandard(standard.id)}
                      type="button"
                      title="Delete Standard"
                    >
                      <Trash className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input
              value={newStandard.ref_no}
              onChange={(e) => handleChangeStandard("ref_no", e.target.value)}
              placeholder="e.g., EN 12345"
            />
          </div>
          <div className="space-y-2">
            <Label>Edition/Date</Label>
            <Input
              value={newStandard.edition_date}
              onChange={(e) =>
                handleChangeStandard("edition_date", e.target.value)
              }
              placeholder="e.g., 2023"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label>Title</Label>
            <div className="flex items-center justify-between gap-2">
              <Input
                value={newStandard.title}
                onChange={(e) => handleChangeStandard("title", e.target.value)}
                placeholder="Standard title"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStandard}
                title="Add This Standard"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
