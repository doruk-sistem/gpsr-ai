import React, { useState } from "react";
import { Shield, Plus, X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useProductForm } from "../../hooks/useProductForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils/cn";

import { UserProductUserRegulation } from "@/lib/services/user-product-user-regulations-service";
import { Regulation } from "@/lib/services/regulations-service";
import {
  useAddUserProductUserRegulation,
  useDeleteUserProductUserRegulation,
} from "@/hooks/use-user-product-user-regulations";
import { useRegulations } from "@/hooks/use-regulations";

export default function Regulations() {
  const { initialData, setInitialData } = useProductForm();

  const [openPopover, setOpenPopover] = useState(false);

  const [selectedRegulations, setSelectedRegulations] = useState<
    UserProductUserRegulation[]
  >(initialData?.selectedUserProductUserRegulations || []);

  const deleteUserRegulation = useDeleteUserProductUserRegulation();
  const addUserRegulation = useAddUserProductUserRegulation();

  const { data: regulations = [] } = useRegulations();

  const handleRemoveRegulation = async (userRegulationId: string) => {
    try {
      await deleteUserRegulation.mutateAsync(userRegulationId);

      const newRegulations = selectedRegulations.filter(
        (s) => s.id !== userRegulationId
      );

      setSelectedRegulations(newRegulations);

      setInitialData({
        ...initialData,
        selectedUserProductUserRegulations: newRegulations,
      });
    } catch (error) {
      console.error("Error removing regulation:", error);
    }
  };

  const handleAddRegulation = async (regulation: Regulation) => {
    try {
      const newRegulation = await addUserRegulation.mutateAsync({
        regulation_name: regulation.regulation_name,
        regulation_number: regulation.regulation_number,
        regulation_description: regulation.regulation_description!,
        regulation_edition_date: regulation.regulation_edition_date!,
        reference_regulation_id: regulation.id,
        user_product_id: initialData?.id!,
      });

      setSelectedRegulations([...selectedRegulations, newRegulation]);

      setInitialData({
        ...initialData,
        selectedUserProductUserRegulations: [
          ...selectedRegulations,
          newRegulation,
        ],
      });
    } catch (error) {
      console.error("Error adding regulation:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Regulations</h3>
      </div>

      <div className="space-y-4">
        {selectedRegulations.length > 0 ? (
          <div className="space-y-2">
            {selectedRegulations.map((regulation) => {
              return (
                <div
                  key={regulation.id}
                  className="flex items-center justify-between px-3 py-2 bg-primary/10 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {regulation?.regulation_name} (
                      {regulation?.regulation_number})
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent"
                    onClick={() => handleRemoveRegulation(regulation.id)}
                    type="button"
                    disabled={deleteUserRegulation.isPending}
                  >
                    <X className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : null}

        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={addUserRegulation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Regulation
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-xl p-0">
            <Command>
              <CommandInput placeholder="Search directives..." />
              <CommandEmpty>No directive found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {regulations.map((regulation) => {
                    const selected = selectedRegulations.find(
                      (d) => d.reference_regulation_id === regulation.id
                    );

                    return (
                      <CommandItem
                        key={regulation.id}
                        value={regulation.regulation_name}
                        onSelect={() => {
                          if (selected) {
                            handleRemoveRegulation(selected.id);
                          } else {
                            handleAddRegulation(regulation);
                          }
                          setOpenPopover(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {regulation.regulation_name} (
                        {regulation.regulation_number})
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
