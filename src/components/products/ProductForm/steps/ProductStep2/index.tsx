"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "@/lib/utils/cn";

import { useRepresentativeAddresses } from "@/hooks/use-representative-addresses";

import { useUpdateProduct } from "@/hooks/use-products";

import { useProductForm } from "../../hooks/useProductForm";

import Standards from "./Standards";
import Directives from "./Directives";
import Regulations from "./Regulations";

export default function ProductStep2() {
  const { initialData, setInitialData, onNextStep } = useProductForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedEuRepId, setSelectedEuRepId] = useState<string | undefined>(
    initialData?.authorised_representative_eu_id
  );
  const [selectedUkRepId, setSelectedUkRepId] = useState<string | undefined>(
    initialData?.authorised_representative_uk_id
  );

  // Popover States
  const [openEuRepPopover, setOpenEuRepPopover] = useState(false);
  const [openUkRepPopover, setOpenUkRepPopover] = useState(false);

  const { data: euAddresses = [] } = useRepresentativeAddresses("eu");
  const { data: ukAddresses = [] } = useRepresentativeAddresses("uk");

  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we have a valid product ID
      if (!initialData?.id) {
        toast.error("Product ID not found");
        return;
      }

      // Form validation
      if (!selectedEuRepId) {
        toast.error("Please select an EU Authorised Representative");
        return;
      }

      if (!selectedUkRepId) {
        toast.error("Please select a UK Authorised Representative");
        return;
      }

      // ===============================
      // Update Authorised Representatives
      // ===============================
      await updateProduct.mutateAsync({
        id: initialData.id,
        product: {
          authorised_representative_eu_id: selectedEuRepId,
          authorised_representative_uk_id: selectedUkRepId,
        },
      });

      // Update the form state
      // Combine remaining items with newly added items
      // This ensures the next step has access to the complete objects
      setInitialData({
        ...initialData,
        authorised_representative_eu_id: selectedEuRepId,
        authorised_representative_uk_id: selectedUkRepId,
      });

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

        {/* Manufacturer and Representatives Section */}
        <div className="space-y-6">
          <div className="space-y-6">
            {/* EU Representative */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-base font-medium text-gray-700">
                  EU Authorised Representative
                </label>

                <Link href="/dashboard/representative">
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4 inline-block mr-1" />
                    Add EU Representative
                  </Button>
                </Link>
              </div>
              <Popover
                open={openEuRepPopover}
                onOpenChange={setOpenEuRepPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEuRepPopover}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {selectedEuRepId
                        ? euAddresses.find((a) => a.id === selectedEuRepId)
                            ?.company_name || "Select EU representative"
                        : "Select EU representative"}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search EU representative..." />
                    <CommandEmpty>No EU representative found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {euAddresses.map((address) => (
                          <CommandItem
                            key={address.id}
                            value={address.company_name}
                            onSelect={() => {
                              setSelectedEuRepId(address.id);
                              setOpenEuRepPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedEuRepId === address.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {address.company_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* UK Representative */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-base font-medium text-gray-700">
                  UK Authorised Representative
                </label>

                <Link href="/dashboard/representative">
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4 inline-block mr-1" />
                    Add UK Representative
                  </Button>
                </Link>
              </div>
              <Popover
                open={openUkRepPopover}
                onOpenChange={setOpenUkRepPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openUkRepPopover}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {selectedUkRepId
                        ? ukAddresses.find((a) => a.id === selectedUkRepId)
                            ?.company_name || "Select UK representative"
                        : "Select UK representative"}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search UK representative..." />
                    <CommandEmpty>No UK representative found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {ukAddresses.map((address) => (
                          <CommandItem
                            key={address.id}
                            value={address.company_name}
                            onSelect={() => {
                              setSelectedUkRepId(address.id);
                              setOpenUkRepPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUkRepId === address.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {address.company_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </div>
    </form>
  );
}
