"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import {
  Package,
  Tag,
  FileText,
  Layers,
  FileBadge,
  FileCheck,
  ShieldCheck,
  Building,
  Check,
  ChevronsUpDown,
  Plus,
  Shield,
} from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Manufacturer } from "@/lib/services/manufacturers-service";
import { PRODUCT_CATEGORY_OPTIONS } from "@/lib/data/product-category-options";
import { cn } from "@/lib/utils/cn";

import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { base64ToFile } from "@/lib/utils/base64ToFile";

interface ProductFormProps {
  initialData?: {
    id?: string;
    category?: string;
    sub_category?: string;
    name?: string;
    require_ce_ukca_marking?: boolean;
    batch_number?: string;
    model_name?: string;
    image_urls?: string[];
    specification?: string[];
    directives?: string[];
    regulations?: string[];
    standards?: string[];
    manufacturer_id?: string;
    authorised_representative_in_eu?: string;
    authorised_representative_in_uk?: string;
  };
  manufacturers: Manufacturer[];
  onSubmit: (data: FormData) => void;
}

export default function ProductForm({
  initialData,
  manufacturers,
  onSubmit,
}: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialData?.sub_category || ""
  );
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [openSubcategoryPopover, setOpenSubcategoryPopover] = useState(false);
  const [openManufacturerPopover, setOpenManufacturerPopover] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>(
    initialData?.manufacturer_id || ""
  );
  const [selectedEUTemp, setSelectedEUTemp] = useState<string>(
    initialData?.authorised_representative_in_eu || ""
  );
  const [selectedUKTemp, setSelectedUKTemp] = useState<string>(
    initialData?.authorised_representative_in_uk || ""
  );
  const [openEUTempPopover, setOpenEUTempPopover] = useState(false);
  const [openUKTempPopover, setOpenUKTempPopover] = useState(false);

  const [directives, setDirectives] = useState<string[]>(
    initialData?.directives || []
  );
  const [regulations, setRegulations] = useState<string[]>(
    initialData?.regulations || []
  );
  const [standards, setStandards] = useState<string[]>(
    initialData?.standards || []
  );

  const [selectedDirective, setSelectedDirective] = useState<string>("");
  const [selectedRegulation, setSelectedRegulation] = useState<string>("");
  const [openDirectivePopover, setOpenDirectivePopover] = useState(false);
  const [openRegulationPopover, setOpenRegulationPopover] = useState(false);

  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategoryOption = PRODUCT_CATEGORY_OPTIONS.find(
      (option) => option.value === selectedCategory
    );
    return selectedCategoryOption?.subcategories || [];
  };

  // Update subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedCategory]);

  const handleImageChange = (imageDataUrl: string, index: number) => {
    const newPreviews = [...imagePreview];
    newPreviews[index] = imageDataUrl;
    setImagePreview(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (imagePreview.length > 0) {
      imagePreview.forEach((image) => {
        formData.set("images", base64ToFile(image, "image.png", "image/png"));
      });
    }

    // Add the selected values from comboboxes
    if (selectedCategory) formData.set("category", selectedCategory);
    else {
      toast.error("Please select a category");
      return;
    }

    if (selectedSubcategory) formData.set("sub_category", selectedSubcategory);
    else {
      toast.error("Please select a subcategory");
      return;
    }

    if (selectedManufacturer)
      formData.set("manufacturer_id", selectedManufacturer);

    if (selectedEUTemp)
      formData.set("authorised_representative_in_eu", selectedEUTemp);
    else {
      toast.error("Please select a authorised representative in EU");
      return;
    }

    if (selectedUKTemp)
      formData.set("authorised_representative_in_uk", selectedUKTemp);
    else {
      toast.error("Please select a authorised representative in UK");
      return;
    }

    onSubmit(formData);
  };

  const handleAddDirective = () => {
    if (selectedDirective) {
      setDirectives([...directives, selectedDirective]);
      setSelectedDirective("");
      document.getElementById("add-directive-section")?.classList.add("hidden");
    }
  };

  const handleAddRegulation = () => {
    if (selectedRegulation) {
      setRegulations([...regulations, selectedRegulation]);
      setSelectedRegulation("");
      document
        .getElementById("add-regulation-section")
        ?.classList.add("hidden");
    }
  };

  const handleAddStandard = () => {
    const refNo = (
      document.querySelector('input[name="standard_ref"]') as HTMLInputElement
    )?.value;
    const date = (
      document.querySelector('input[name="standard_date"]') as HTMLInputElement
    )?.value;
    const title = (
      document.querySelector('input[name="standard_title"]') as HTMLInputElement
    )?.value;

    if (refNo && title) {
      const newStandard = `${refNo} ${date ? `(${date})` : ""} | ${title}`;

      setStandards([...standards, newStandard]);

      // Form alanlarını temizle
      if (
        document.querySelector('input[name="standard_ref"]') as HTMLInputElement
      ) {
        (
          document.querySelector(
            'input[name="standard_ref"]'
          ) as HTMLInputElement
        ).value = "";
      }
      if (
        document.querySelector(
          'input[name="standard_date"]'
        ) as HTMLInputElement
      ) {
        (
          document.querySelector(
            'input[name="standard_date"]'
          ) as HTMLInputElement
        ).value = "";
      }
      if (
        document.querySelector(
          'input[name="standard_title"]'
        ) as HTMLInputElement
      ) {
        (
          document.querySelector(
            'input[name="standard_title"]'
          ) as HTMLInputElement
        ).value = "";
      }

      // Gizli bölümü kapat
      document.getElementById("add-standard-section")?.classList.add("hidden");
    } else {
      alert("Lütfen en az bir referans numarası ve başlık girin");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card className="border shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {initialData ? "Edit Product" : "Add New Product"}
                    </h1>
                    <p className="text-muted-foreground">
                      Register your product for GPSR compliance
                    </p>
                  </div>
                </div>
                <Button type="submit" size="lg">
                  {initialData ? "Update Product" : "Save Product"}
                </Button>
              </div>

              <div className="space-y-8">
                {/* Product Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Category
                    </label>
                    <Popover
                      open={openCategoryPopover}
                      onOpenChange={setOpenCategoryPopover}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategoryPopover}
                          className="w-full justify-between h-12 text-lg bg-white"
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            {selectedCategory
                              ? PRODUCT_CATEGORY_OPTIONS.find(
                                  (category) =>
                                    category.value === selectedCategory
                                )?.label || "Select a category"
                              : "Select a category"}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {PRODUCT_CATEGORY_OPTIONS.map((category) => (
                                <CommandItem
                                  key={category.value}
                                  value={category.value}
                                  onSelect={(currentValue) => {
                                    setSelectedCategory(currentValue);
                                    setOpenCategoryPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCategory === category.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <Popover
                      open={openSubcategoryPopover}
                      onOpenChange={setOpenSubcategoryPopover}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubcategoryPopover}
                          className="w-full justify-between h-12 text-lg bg-white"
                          disabled={!selectedCategory}
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-gray-400" />
                            {selectedSubcategory
                              ? getSubcategories().find(
                                  (subcategory) =>
                                    subcategory.value === selectedSubcategory
                                )?.label || "Select a subcategory"
                              : "Select a subcategory"}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search subcategory..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No subcategory found.</CommandEmpty>
                            <CommandGroup>
                              {getSubcategories().map((subcategory) => (
                                <CommandItem
                                  key={subcategory.value}
                                  value={subcategory.value}
                                  onSelect={(currentValue) => {
                                    setSelectedSubcategory(currentValue);
                                    setOpenSubcategoryPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSubcategory === subcategory.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {subcategory.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* CE/UKCA Marking Requirement */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Does your product require CE/UKCA marking?
                  </label>
                  <RadioGroup
                    name="require_ce_ukca_marking"
                    defaultValue={
                      initialData?.require_ce_ukca_marking ? "true" : "false"
                    }
                    className="flex space-x-8"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="ce-yes" />
                      <Label htmlFor="ce-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="ce-no" />
                      <Label htmlFor="ce-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Product Name, Batch Number, and Model Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        name="name"
                        placeholder="Enter product name"
                        defaultValue={initialData?.name}
                        className="pl-12 bg-white h-12 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Batch Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileBadge className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        name="batch_number"
                        placeholder="Enter batch number"
                        defaultValue={initialData?.batch_number}
                        className="pl-12 bg-white h-12 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Model Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        name="model_name"
                        placeholder="Enter model name"
                        defaultValue={initialData?.model_name}
                        className="pl-12 bg-white h-12 text-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1].map((index) => (
                      <ImageUploadField
                        key={index}
                        imagePreview={
                          imagePreview[index] ||
                          (initialData?.image_urls || ["", ""])[index]
                        }
                        onImageChange={(e, imageDataUrl) =>
                          handleImageChange(imageDataUrl, index)
                        }
                        altText={`Product image ${index + 1}`}
                        name="image"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications (One per line)
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    List key technical characteristics relevant to compliance
                    assessment.
                  </p>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <Textarea
                      name="specification"
                      placeholder="Enter product specifications, one per line"
                      defaultValue={initialData?.specification?.join("\n")}
                      className="pl-12 bg-white min-h-[120px] text-lg resize-none"
                    />
                  </div>
                </div>

                {/* Directives */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Directives
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center text-primary text-sm"
                      onClick={() =>
                        document
                          .getElementById("add-directive-section")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Additional Directive
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {directives.map((directive, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`directive-${index}`}
                          name="directives"
                          value={directive}
                          defaultChecked={true}
                          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`directive-${index}`}
                          className="text-gray-700"
                        >
                          Directive {index + 1}
                        </label>
                        <div className="flex-1 text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                          {directive}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    id="add-directive-section"
                    className="hidden space-y-4 border rounded-md p-4 mt-2 bg-gray-50"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Directive
                      </label>
                      <Popover
                        open={openDirectivePopover}
                        onOpenChange={setOpenDirectivePopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDirectivePopover}
                            className="w-full justify-between h-10 text-sm bg-white"
                          >
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-gray-400" />
                              {selectedDirective || "Select a directive"}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search directive..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No directive found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="Low Voltage Directive (2014/35/EU)"
                                  onSelect={(value) => {
                                    setSelectedDirective(value);
                                    setOpenDirectivePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDirective ===
                                        "Low Voltage Directive (2014/35/EU)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Low Voltage Directive (2014/35/EU)
                                </CommandItem>
                                <CommandItem
                                  value="Machinery Directive (2006/42/EC)"
                                  onSelect={(value) => {
                                    setSelectedDirective(value);
                                    setOpenDirectivePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDirective ===
                                        "Machinery Directive (2006/42/EC)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Machinery Directive (2006/42/EC)
                                </CommandItem>
                                <CommandItem
                                  value="Toys Safety Directive (2009/48/EC)"
                                  onSelect={(value) => {
                                    setSelectedDirective(value);
                                    setOpenDirectivePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDirective ===
                                        "Toys Safety Directive (2009/48/EC)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Toys Safety Directive (2009/48/EC)
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleAddDirective}>
                        Add Directive
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Regulations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Regulations
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center text-primary text-sm"
                      onClick={() =>
                        document
                          .getElementById("add-regulation-section")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Additional Regulation
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {regulations.map((regulation, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`regulation-${index}`}
                          name="regulations"
                          value={regulation}
                          defaultChecked={true}
                          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`regulation-${index}`}
                          className="text-gray-700"
                        >
                          Regulation {index + 1}
                        </label>
                        <div className="flex-1 text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                          {regulation}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    id="add-regulation-section"
                    className="hidden space-y-4 border rounded-md p-4 mt-2 bg-gray-50"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Regulation
                      </label>
                      <Popover
                        open={openRegulationPopover}
                        onOpenChange={setOpenRegulationPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openRegulationPopover}
                            className="w-full justify-between h-10 text-sm bg-white"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-gray-400" />
                              {selectedRegulation || "Select a regulation"}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search regulation..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No regulation found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="Toy Safety Regulations 2011 (SI 2011/1881)"
                                  onSelect={(value) => {
                                    setSelectedRegulation(value);
                                    setOpenRegulationPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedRegulation ===
                                        "Toy Safety Regulations 2011 (SI 2011/1881)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Toy Safety Regulations 2011 (SI 2011/1881)
                                </CommandItem>
                                <CommandItem
                                  value="Personal Protective Equipment Regulations 2018 (SI 2018/390)"
                                  onSelect={(value) => {
                                    setSelectedRegulation(value);
                                    setOpenRegulationPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedRegulation ===
                                        "Personal Protective Equipment Regulations 2018 (SI 2018/390)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Personal Protective Equipment Regulations 2018
                                  (SI 2018/390)
                                </CommandItem>
                                <CommandItem
                                  value="The Electrical Equipment (Safety) Regulations 2016 (SI 2016/1101)"
                                  onSelect={(value) => {
                                    setSelectedRegulation(value);
                                    setOpenRegulationPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedRegulation ===
                                        "The Electrical Equipment (Safety) Regulations 2016 (SI 2016/1101)"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  The Electrical Equipment (Safety) Regulations
                                  2016 (SI 2016/1101)
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-end">
                      <Button type="button" onClick={handleAddRegulation}>
                        Add Regulation
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Standards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Standards
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center text-primary text-sm"
                      onClick={() =>
                        document
                          .getElementById("add-standard-section")
                          ?.classList.toggle("hidden")
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Additional Standard
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {standards.map((standard, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`standard-${index}`}
                          name="standards"
                          value={standard}
                          defaultChecked={true}
                          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`standard-${index}`}
                          className="text-gray-700"
                        >
                          Standard {index + 1}
                        </label>
                        <div className="flex-1 text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                          {standard}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    id="add-standard-section"
                    className="hidden space-y-4 border rounded-md p-4 mt-2 bg-gray-50"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          Ref No{" "}
                          <span className="ml-1 w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                            i
                          </span>
                        </label>
                        <Input
                          name="standard_ref"
                          placeholder="e.g. EN 71-1"
                          className="bg-white h-10"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          Edition/Date{" "}
                          <span className="ml-1 w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                            i
                          </span>
                        </label>
                        <Input
                          name="standard_date"
                          placeholder="e.g. 2014"
                          className="bg-white h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Title{" "}
                        <span className="ml-1 w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                          i
                        </span>
                      </label>
                      <div className="flex items-center gap-4">
                        <Input
                          name="standard_title"
                          placeholder="Enter standard title"
                          className="bg-white h-10 flex-1"
                        />
                        <Button
                          type="button"
                          className="h-10"
                          onClick={handleAddStandard}
                        >
                          Add Standard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manufacturer Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Manufacturer Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Manufacturer
                        </label>

                        <Link href="/dashboard/manufacturers/add">
                          <Button
                            variant="ghost"
                            type="button"
                            className="text-sm text-primary hover:text-primary/80"
                          >
                            <Plus className="w-4 h-4 inline-block mr-1" />
                            Add Manufacturer
                          </Button>
                        </Link>
                      </div>
                      <Popover
                        open={openManufacturerPopover}
                        onOpenChange={setOpenManufacturerPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openManufacturerPopover}
                            className="w-full justify-between h-10 text-sm bg-white"
                          >
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              {selectedManufacturer
                                ? manufacturers.find(
                                    (manufacturer) =>
                                      manufacturer.id === selectedManufacturer
                                  )?.name || "Select Manufacturer"
                                : "Select Manufacturer"}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0"
                          style={{
                            width: "var(--radix-popover-trigger-width)",
                          }}
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search manufacturer..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No manufacturer found.
                              </CommandEmpty>
                              <CommandGroup>
                                {manufacturers.map((manufacturer) => (
                                  <CommandItem
                                    key={manufacturer.id}
                                    value={manufacturer.id}
                                    onSelect={(currentValue) => {
                                      setSelectedManufacturer(currentValue);
                                      setOpenManufacturerPopover(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedManufacturer === manufacturer.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {manufacturer.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Authorised Representative in EU
                        </label>
                        <Button
                          variant="ghost"
                          type="button"
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          <Plus className="w-4 h-4 inline-block mr-1" />
                          Add AR in EU
                        </Button>
                      </div>
                      <Popover
                        open={openEUTempPopover}
                        onOpenChange={setOpenEUTempPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openEUTempPopover}
                            className="w-full justify-between h-10 text-sm bg-white"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              {selectedEUTemp || "Not for EU sale"}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search EU representative..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No representative found.
                              </CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="EU Representative 1"
                                  onSelect={(value) => {
                                    setSelectedEUTemp(value);
                                    setOpenEUTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedEUTemp === "EU Representative 1"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  EU Representative 1
                                </CommandItem>
                                <CommandItem
                                  value="EU Representative 2"
                                  onSelect={(value) => {
                                    setSelectedEUTemp(value);
                                    setOpenEUTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedEUTemp === "EU Representative 2"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  EU Representative 2
                                </CommandItem>
                                <CommandItem
                                  value="Not for EU sale"
                                  onSelect={(value) => {
                                    setSelectedEUTemp(value);
                                    setOpenEUTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedEUTemp === "Not for EU sale"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Not for EU sale
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Authorised Representative in UK
                        </label>
                        <Button
                          variant="ghost"
                          type="button"
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          <Plus className="w-4 h-4 inline-block mr-1" />
                          Add AR in UK
                        </Button>
                      </div>
                      <Popover
                        open={openUKTempPopover}
                        onOpenChange={setOpenUKTempPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openUKTempPopover}
                            className="w-full justify-between h-10 text-sm bg-white"
                          >
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-gray-400" />
                              {selectedUKTemp || "Not for UK sale"}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search UK representative..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No representative found.
                              </CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="UK Representative 1"
                                  onSelect={(value) => {
                                    setSelectedUKTemp(value);
                                    setOpenUKTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUKTemp === "UK Representative 1"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  UK Representative 1
                                </CommandItem>
                                <CommandItem
                                  value="UK Representative 2"
                                  onSelect={(value) => {
                                    setSelectedUKTemp(value);
                                    setOpenUKTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUKTemp === "UK Representative 2"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  UK Representative 2
                                </CommandItem>
                                <CommandItem
                                  value="Not for UK sale"
                                  onSelect={(value) => {
                                    setSelectedUKTemp(value);
                                    setOpenUKTempPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedUKTemp === "Not for UK sale"
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  Not for UK sale
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
