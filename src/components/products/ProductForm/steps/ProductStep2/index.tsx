"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useProductForm } from "../../hooks/useProductForm";

import Standards from "./Standards";
import Directives from "./Directives";
import Regulations from "./Regulations";

export default function ProductStep2() {
  const { initialData, setInitialData, onNextStep } = useProductForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we have a valid product ID
      if (!initialData?.id) {
        toast.error("Product ID not found");
        return;
      }

      // Update the form state
      // Combine remaining items with newly added items
      // This ensures the next step has access to the complete objects
      setInitialData(initialData);

      onNextStep();
    } catch (error) {
      console.error("Error updating compliance data:", error);
      toast.error("Failed to update compliance data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Directives />
        <Regulations />
        <Standards />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </div>
    </form>
  );
}
