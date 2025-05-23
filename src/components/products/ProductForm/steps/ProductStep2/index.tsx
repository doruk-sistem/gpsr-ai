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
import {
  Check,
  ChevronsUpDown,
  Plus,
  FileText,
  Shield,
  X,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "@/lib/utils/cn";

import { useDirectives } from "@/hooks/use-directives";
import { useRegulations } from "@/hooks/use-regulations";
import { useRepresentativeAddresses } from "@/hooks/use-representative-addresses";
import {
  useAddProductDirective,
  useRemoveProductDirective,
} from "@/hooks/use-product-directives";
import {
  useAddProductRegulation,
  useRemoveProductRegulation,
} from "@/hooks/use-product-regulations";

import { ProductDirective } from "@/lib/services/product-directives-service";
import { ProductRegulation } from "@/lib/services/product-regulations-service";

import { useUpdateProduct } from "@/hooks/use-products";
import { useProductForm } from "../../hooks/useProductForm";
import Standards from "./Standards";

// TODO Ai support for directives, regulations and standards
// TODO Add next step (technical files)
export default function ProductStep2() {
  const { initialData, setInitialData, onNextStep } = useProductForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDirectiveIds, setSelectedDirectiveIds] = useState<number[]>(
    initialData?.selectedDirectives?.map((d) => d.directive_id) || []
  );
  const [selectedRegulationIds, setSelectedRegulationIds] = useState<number[]>(
    initialData?.selectedRegulations?.map((r) => r.regulation_id) || []
  );
  const [selectedEuRepId, setSelectedEuRepId] = useState<string | undefined>(
    initialData?.authorised_representative_eu_id
  );
  const [selectedUkRepId, setSelectedUkRepId] = useState<string | undefined>(
    initialData?.authorised_representative_uk_id
  );

  // Popover States
  const [openDirectivePopover, setOpenDirectivePopover] = useState(false);
  const [openRegulationPopover, setOpenRegulationPopover] = useState(false);
  const [openEuRepPopover, setOpenEuRepPopover] = useState(false);
  const [openUkRepPopover, setOpenUkRepPopover] = useState(false);

  const { data: directives = [] } = useDirectives();
  const { data: regulations = [] } = useRegulations();
  const { data: euAddresses = [] } = useRepresentativeAddresses("eu");
  const { data: ukAddresses = [] } = useRepresentativeAddresses("uk");

  const addProductDirective = useAddProductDirective();
  const removeProductDirective = useRemoveProductDirective();
  const addProductRegulation = useAddProductRegulation();
  const removeProductRegulation = useRemoveProductRegulation();
  const updateProduct = useUpdateProduct();

  const handleDirectiveToggle = (directiveId: number) => {
    if (selectedDirectiveIds.includes(directiveId)) {
      setSelectedDirectiveIds(
        selectedDirectiveIds.filter((id) => id !== directiveId)
      );
    } else {
      setSelectedDirectiveIds([...selectedDirectiveIds, directiveId]);
    }
  };

  const handleRegulationToggle = (regulationId: number) => {
    if (selectedRegulationIds.includes(regulationId)) {
      setSelectedRegulationIds(
        selectedRegulationIds.filter((id) => id !== regulationId)
      );
    } else {
      setSelectedRegulationIds([...selectedRegulationIds, regulationId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we have a valid product ID
      if (!initialData?.id) {
        toast.error("Product ID not found");
        return;
      }

      // ===============================
      // Handle Directives
      // ===============================
      // Get current directive IDs from the initial data
      // This represents the directives that were previously saved for this product
      const currentDirectiveIds =
        initialData.selectedDirectives?.map((d) => d.directive_id) || [];

      // Find directives that need to be removed
      // These are directives that exist in the database but are no longer selected by the user
      const directivesToRemove =
        initialData.selectedDirectives?.filter(
          (d) => !selectedDirectiveIds.includes(d.directive_id)
        ) || [];

      // Find directives that need to be added
      // These are new directives that the user has selected but weren't previously saved
      const directivesToAdd = selectedDirectiveIds.filter(
        (id) => !currentDirectiveIds.includes(id)
      );

      // Array to store newly added directives
      // We'll need these to update the form state with the complete directive objects
      const addedDirectives: ProductDirective[] = [];

      // Add new directives to the database
      // For each new directive, create a many-to-many relationship in user_product_directives table
      for (const directiveId of directivesToAdd) {
        const newDirective = await addProductDirective.mutateAsync({
          productId: initialData.id,
          directiveId,
        });
        addedDirectives.push(newDirective);
      }

      // Remove directives that are no longer selected
      // Delete the many-to-many relationships from user_product_directives table
      for (const directive of directivesToRemove) {
        await removeProductDirective.mutateAsync({
          productId: initialData.id,
          directiveId: directive.directive_id,
        });
      }

      // Get the directives that were kept (not removed)
      // These are the directives that were previously saved and are still selected
      const remainingDirectives =
        initialData.selectedDirectives?.filter((d) =>
          selectedDirectiveIds.includes(d.directive_id)
        ) || [];

      // ===============================
      // Handle Regulations
      // ===============================
      // Get current regulation IDs from the initial data
      // This represents the regulations that were previously saved for this product
      const currentRegulationIds =
        initialData.selectedRegulations?.map((r) => r.regulation_id) || [];

      // Find regulations that need to be removed
      // These are regulations that exist in the database but are no longer selected by the user
      const regulationsToRemove =
        initialData.selectedRegulations?.filter(
          (r) => !selectedRegulationIds.includes(r.regulation_id)
        ) || [];

      // Find regulations that need to be added
      // These are new regulations that the user has selected but weren't previously saved
      const regulationsToAdd = selectedRegulationIds.filter(
        (id) => !currentRegulationIds.includes(id)
      );

      // Array to store newly added regulations
      // We'll need these to update the form state with the complete regulation objects
      const addedRegulations: ProductRegulation[] = [];

      // Add new regulations to the database
      // For each new regulation, create a many-to-many relationship in user_product_regulations table
      for (const regulationId of regulationsToAdd) {
        const newRegulation = await addProductRegulation.mutateAsync({
          productId: initialData.id,
          regulationId,
        });
        addedRegulations.push(newRegulation);
      }

      // Remove regulations that are no longer selected
      // Delete the many-to-many relationships from user_product_regulations table
      for (const regulation of regulationsToRemove) {
        await removeProductRegulation.mutateAsync({
          productId: initialData.id,
          regulationId: regulation.regulation_id,
        });
      }

      // Get the regulations that were kept (not removed)
      // These are the regulations that were previously saved and are still selected
      const remainingRegulations =
        initialData.selectedRegulations?.filter((r) =>
          selectedRegulationIds.includes(r.regulation_id)
        ) || [];

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
        selectedDirectives: [...remainingDirectives, ...addedDirectives],
        selectedRegulations: [...remainingRegulations, ...addedRegulations],
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
        {/* Directives Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Directives</h3>
          </div>

          <div className="space-y-4">
            {selectedDirectiveIds.length > 0 ? (
              <div className="space-y-2">
                {selectedDirectiveIds.map((directiveId) => {
                  const directive = directives.find(
                    (d) => d.id === directiveId
                  );
                  return (
                    <div
                      key={directiveId}
                      className="flex items-center justify-between px-3 py-2 bg-primary/10 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {directive?.directive_name} (
                          {directive?.directive_number})
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent"
                        onClick={() => handleDirectiveToggle(directiveId)}
                      >
                        <X className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <Popover
              open={openDirectivePopover}
              onOpenChange={setOpenDirectivePopover}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Directive
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-xl p-0">
                <Command>
                  <CommandInput placeholder="Search directives..." />
                  <CommandEmpty>No directive found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {directives.map((directive) => (
                        <CommandItem
                          key={directive.id}
                          value={directive.directive_name}
                          onSelect={() => {
                            handleDirectiveToggle(directive.id);
                            setOpenDirectivePopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDirectiveIds.includes(directive.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {directive.directive_name} (
                          {directive.directive_number})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Regulations Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Regulations</h3>
          </div>

          <div className="space-y-4">
            {selectedRegulationIds.length > 0 ? (
              <div className="space-y-2">
                {selectedRegulationIds.map((regulationId) => {
                  const regulation = regulations.find(
                    (r) => r.id === regulationId
                  );
                  return (
                    <div
                      key={regulationId}
                      className="flex items-center justify-between px-3 py-2 bg-primary/10 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {regulation?.regulation_name}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent"
                        onClick={() => handleRegulationToggle(regulationId)}
                      >
                        <X className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <Popover
              open={openRegulationPopover}
              onOpenChange={setOpenRegulationPopover}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Regulation
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-xl p-0">
                <Command>
                  <CommandInput placeholder="Search regulations..." />
                  <CommandEmpty>No regulation found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {regulations.map((regulation) => (
                        <CommandItem
                          key={regulation.id}
                          value={regulation.regulation_name}
                          onSelect={() => {
                            handleRegulationToggle(regulation.id);
                            setOpenRegulationPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedRegulationIds.includes(regulation.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {regulation.regulation_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

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
