import React, { useState } from "react";
import { Shield, Plus, X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useProductForm } from "../../hooks/useProductForm";
import { useDirectives } from "@/hooks/use-directives";
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

import {
  useAddUserProductUserDirective,
  useDeleteUserProductUserDirective,
} from "@/hooks/use-user-product-user-directives";

import { UserProductUserDirective } from "@/lib/services/user-product-user-directives-service";
import { Directive } from "@/lib/services/directives-service";

export default function Directives() {
  const { initialData, setInitialData } = useProductForm();

  const [openPopover, setOpenPopover] = useState(false);

  const [selectedDirectives, setSelectedDirectives] = useState<
    UserProductUserDirective[]
  >(initialData?.selectedUserProductUserDirectives || []);

  const deleteUserDirective = useDeleteUserProductUserDirective();
  const addUserDirective = useAddUserProductUserDirective();

  const { data: directives = [] } = useDirectives();

  const handleRemoveDirective = async (userDirectiveId: string) => {
    try {
      await deleteUserDirective.mutateAsync(userDirectiveId);

      const newDirectives = selectedDirectives.filter(
        (s) => s.id !== userDirectiveId
      );

      setSelectedDirectives(newDirectives);

      setInitialData({
        ...initialData,
        selectedUserProductUserDirectives: newDirectives,
      });
    } catch (error) {
      console.error("Error removing directive:", error);
    }
  };

  const handleAddDirective = async (directive: Directive) => {
    try {
      const newDirective = await addUserDirective.mutateAsync({
        directive_name: directive.directive_name,
        directive_number: directive.directive_number,
        directive_description: directive.directive_description!,
        directive_edition_date: directive.directive_edition_date!,
        reference_directive_id: directive.id,
        user_product_id: initialData?.id!,
      });

      setSelectedDirectives([...selectedDirectives, newDirective]);

      setInitialData({
        ...initialData,
        selectedUserProductUserDirectives: [
          ...selectedDirectives,
          newDirective,
        ],
      });
    } catch (error) {
      console.error("Error adding directive:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Directives</h3>
      </div>

      <div className="space-y-4">
        {selectedDirectives.length > 0 ? (
          <div className="space-y-2">
            {selectedDirectives.map((directive) => {
              return (
                <div
                  key={directive.id}
                  className="flex items-center justify-between px-3 py-2 bg-primary/10 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {directive?.directive_name} ({directive?.directive_number}
                      )
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent"
                    onClick={() => handleRemoveDirective(directive.id)}
                    type="button"
                    disabled={deleteUserDirective.isPending}
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
              disabled={addUserDirective.isPending}
            >
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
                  {directives.map((directive) => {
                    const selected = selectedDirectives.find(
                      (d) => d.reference_directive_id === directive.id
                    );

                    return (
                      <CommandItem
                        key={directive.id}
                        value={directive.directive_name}
                        onSelect={() => {
                          if (selected) {
                            handleRemoveDirective(selected.id);
                          } else {
                            handleAddDirective(directive);
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
                        {directive.directive_name} ({directive.directive_number}
                        )
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
