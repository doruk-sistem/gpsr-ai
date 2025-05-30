"use client";
import React, {
  useCallback,
  useState,
  forwardRef,
  useEffect,
  useMemo,
} from "react";

// shadcn
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

import { FixedSizeList } from "react-window";

// utils
import { cn } from "@/lib/utils/cn";

// assets
import { ChevronDown, CheckIcon, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import { countries } from "country-data-list";

export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country | null) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
  className?: string;
  showClearOption?: boolean;
}

// Pre-filtered country list
const filteredCountries = countries.all
  .filter(
    (country: Country) =>
      country.emoji &&
      country.status !== "deleted" &&
      country.ioc !== "PRK" &&
      country.name
  )
  .sort((a, b) => a.name.localeCompare(b.name));

// Clear option to add at the beginning
const clearOption = {
  alpha2: "",
  alpha3: "",
  countryCallingCodes: [],
  currencies: [],
  ioc: "",
  languages: [],
  name: "All Countries",
  status: "clear",
} as Country;

const ITEM_HEIGHT = 36; // Each item height
const LIST_HEIGHT = 270; // List container height

// Item render function
const CountryItem = React.memo(({ data, index, style }: any) => {
  const { items, selectedCountry, onSelect } = data;
  const country = items[index];

  if (!country) return null;

  const isClearOption = country.status === "clear";

  return (
    <div style={style}>
      <CommandItem
        className="flex items-center gap-2"
        onSelect={() => onSelect(country)}
      >
        <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
          <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
            {isClearOption ? (
              <Globe className="h-4 w-4 text-muted-foreground" />
            ) : (
              <CircleFlag
                countryCode={country.alpha2.toLowerCase()}
                height={20}
              />
            )}
          </div>
          <span
            className={cn(
              "overflow-hidden text-ellipsis whitespace-nowrap",
              isClearOption && "text-muted-foreground font-medium"
            )}
          >
            {country.name}
          </span>
        </div>
        <CheckIcon
          className={cn(
            "ml-auto h-4 w-4 shrink-0",
            (isClearOption && !selectedCountry) ||
              country.alpha3 === selectedCountry?.alpha3
              ? "opacity-100"
              : "opacity-0"
          )}
        />
      </CommandItem>
    </div>
  );
});

CountryItem.displayName = "CountryItem";

const CountryDropdownComponent = (
  {
    options = filteredCountries,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    className,
    showClearOption = true,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Add clear option to the beginning if enabled
  const optionsWithClear = useMemo(() => {
    if (showClearOption) {
      return [clearOption, ...options];
    }
    return options;
  }, [options, showClearOption]);

  // Filter search results
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return optionsWithClear;

    const query = searchQuery.toLowerCase();
    return optionsWithClear.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.alpha2.toLowerCase().includes(query) ||
        country.alpha3.toLowerCase().includes(query)
    );
  }, [optionsWithClear, searchQuery]);

  // Set the selected country
  useEffect(() => {
    if (defaultValue && options.length > 0) {
      const initialCountry = options.find(
        (country) =>
          country.alpha3 === defaultValue || country.alpha2 === defaultValue
      );
      setSelectedCountry(initialCountry);
    } else {
      setSelectedCountry(undefined);
    }
  }, [defaultValue, options]);

  // Select handler
  const handleSelect = useCallback(
    (country: Country) => {
      if (country.status === "clear") {
        setSelectedCountry(undefined);
        onChange?.(null);
      } else {
        setSelectedCountry(country);
        onChange?.(country);
      }
      setOpen(false);
      setSearchQuery("");
    },
    [onChange]
  );

  // CSS classes
  const triggerClasses = cn(
    "flex items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20",
    className
  );

  const itemData = useMemo(
    () => ({
      items: filteredOptions,
      selectedCountry,
      onSelect: handleSelect,
    }),
    [filteredOptions, selectedCountry, handleSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountry ? (
          <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
              <CircleFlag
                countryCode={selectedCountry.alpha2.toLowerCase()}
                height={20}
              />
            </div>
            {slim === false && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountry.name}
              </span>
            )}
          </div>
        ) : (
          <span>{slim === false ? placeholder : <Globe size={20} />}</span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command className="w-full">
          <CommandInput
            placeholder="Search country..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[270px] overflow-hidden">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <FixedSizeList
                height={LIST_HEIGHT}
                itemCount={filteredOptions.length}
                itemSize={ITEM_HEIGHT}
                width="100%"
                itemData={itemData}
              >
                {CountryItem}
              </FixedSizeList>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
