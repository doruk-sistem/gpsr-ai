"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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
  Package,
  Tag,
  FileBadge,
  FileText,
  Plus,
  Building,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import { base64ToFile } from "@/lib/utils/base64ToFile";
import storageService from "@/lib/services/storage-service";

import { useCategories } from "@/hooks/use-product-categories";
import { useProductTypesByCategory } from "@/hooks/use-product-types";
import { useQuestionsByCategoryAndProductType } from "@/hooks/use-product-questions";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useCreateProduct,
  useSaveDefaultDirectivesRegulationsStandards,
  useUpdateProduct,
} from "@/hooks/use-products";
import {
  useCreateProductQuestionAnswers,
  useDeleteProductQuestionAnswersByIds,
} from "@/hooks/use-product-question-answers";
import { useManufacturers } from "@/hooks/use-manufacturers";

import {
  Product,
  SaveDefaultDirectivesRegulationsStandardsResponse,
} from "@/lib/services/products-service";

import { useProductForm } from "../../hooks/useProductForm";
import { ProductQuestionAnswer } from "@/lib/services/product-question-answers-service";
import { useRepresentativeAddresses } from "@/hooks/use-representative-addresses";

export default function ProductStep1() {
  const { initialData, setInitialData, onNextStep, mode } = useProductForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(initialData?.category_id);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | undefined
  >(initialData?.product_type_id);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(
    initialData?.selectedQuestions?.map((q) => q.question_id) || []
  );
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<
    string | undefined
  >(initialData?.manufacturer_id);
  const [selectedEuRepId, setSelectedEuRepId] = useState<string | undefined>(
    initialData?.authorised_representative_eu_id
  );
  const [selectedUkRepId, setSelectedUkRepId] = useState<string | undefined>(
    initialData?.authorised_representative_uk_id
  );

  // Popover States
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [openSubcategoryPopover, setOpenSubcategoryPopover] = useState(false);
  const [openManufacturerPopover, setOpenManufacturerPopover] = useState(false);
  const [openEuRepPopover, setOpenEuRepPopover] = useState(false);
  const [openUkRepPopover, setOpenUkRepPopover] = useState(false);

  const { data: user } = useCurrentUser();

  const updateProduct = useUpdateProduct();
  const createProduct = useCreateProduct();
  const deleteProductQuestionAnswers = useDeleteProductQuestionAnswersByIds();
  const createProductQuestionAnswers = useCreateProductQuestionAnswers();
  const saveDefaultDirectivesRegulationsStandards =
    useSaveDefaultDirectivesRegulationsStandards();

  const { data: manufacturers = [] } = useManufacturers();
  const { data: categories = [] } = useCategories({
    select: {
      id: true,
      name: true,
    },
  });
  const { data: productTypes = [] } = useProductTypesByCategory({
    categoryId: selectedCategoryId || 0,
    select: {
      id: true,
      product: true,
    },
  });
  const { data: questions = [] } = useQuestionsByCategoryAndProductType({
    categoryId: selectedCategoryId || 0,
    productTypeId: selectedProductTypeId || 0,
    select: {
      id: true,
      question: true,
      question_description: true,
    },
  });
  const { data: euAddresses = [] } = useRepresentativeAddresses("eu");
  const { data: ukAddresses = [] } = useRepresentativeAddresses("uk");

  const handleImageChange = (imageDataUrl: string, index: number) => {
    const newPreviews = [...imagePreview];
    newPreviews[index] = imageDataUrl;
    setImagePreview(newPreviews);
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedProductTypeId(undefined);
    setSelectedQuestions([]);
  };

  const handleProductTypeChange = (productTypeId: number) => {
    setSelectedProductTypeId(productTypeId);
    setSelectedQuestions([]);
  };

  const handleQuestionToggle = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);

    try {
      e.preventDefault();

      // ===============================
      // Form Validation
      // ===============================
      if (!selectedCategoryId) {
        toast.error("Please select a category");
        return;
      }

      if (!selectedProductTypeId) {
        toast.error("Please select a product type");
        return;
      }

      if (!selectedManufacturerId) {
        toast.error("Please select a manufacturer");
        return;
      }

      const formData = new FormData(e.target as HTMLFormElement);
      const productName = formData.get("name") as string;
      const batchNumber = formData.get("batch_number") as string;
      const modelName = formData.get("model_name") as string;

      if (!productName?.trim()) {
        toast.error("Please enter a product name");
        return;
      }

      if (!batchNumber?.trim()) {
        toast.error("Please enter a batch number");
        return;
      }

      if (!modelName?.trim()) {
        toast.error("Please enter a model name");
        return;
      }

      if (!selectedEuRepId && !selectedUkRepId) {
        toast.error(
          "Please select an Authorised Representative for at least one region"
        );
        return;
      }

      // Check if at least one product image is uploaded
      const hasExistingImages = (initialData?.image_urls || []).length > 0;
      const hasNewImages = imagePreview.some((preview) => preview);

      if (!hasExistingImages && !hasNewImages) {
        toast.error("Please upload at least one product image");
        return;
      }
      // ===============================
      // End - Form Validation
      // ===============================

      const imageFiles =
        imagePreview.length > 0
          ? imagePreview.map((image) =>
              base64ToFile(image, "image.png", "image/png")
            )
          : [];
      const imageUrls = initialData?.image_urls || [];

      // Upload all product images
      for (const imageFile of imageFiles) {
        if (imageFile.size > 0) {
          const { publicUrl } = await storageService.uploadProductFile(
            imageFile,
            user?.id as string
          );
          imageUrls.push(publicUrl);
        }
      }

      const data = {
        name: productName,
        require_ce_ukca_marking:
          formData.get("require_ce_ukca_marking") === "true",
        batch_number: batchNumber,
        model_name: modelName,
        image_urls: imageUrls,
        specification: formData.get("specification") as string,
        category_id: selectedCategoryId,
        product_type_id: selectedProductTypeId,
        manufacturer_id: selectedManufacturerId as string,
        authorised_representative_eu_id: selectedEuRepId,
        authorised_representative_uk_id: selectedUkRepId,
      };

      console.log(data);

      let newProduct: Product | null = null;
      let newProductQuestionAnswers: ProductQuestionAnswer[] | null = null;
      let defaultDirectivesRegulationsStandards: SaveDefaultDirectivesRegulationsStandardsResponse | null =
        null;

      if (mode === "create") {
        // Create the product
        newProduct = await createProduct.mutateAsync(data);

        // Save product question answers if there are any selected
        if (newProduct && selectedQuestions.length > 0) {
          const questionAnswers = selectedQuestions.map((questionId) => ({
            question_id: questionId,
            answer: true,
          }));

          newProductQuestionAnswers =
            await createProductQuestionAnswers.mutateAsync({
              productId: newProduct.id,
              questionAnswers,
            });
        }

        const regions = [];

        if (selectedEuRepId) regions.push("eu");
        if (selectedUkRepId) regions.push("uk");

        defaultDirectivesRegulationsStandards =
          await saveDefaultDirectivesRegulationsStandards.mutateAsync({
            userProductId: newProduct?.id as string,
            categoryName:
              categories.find((cat) => cat.id === selectedCategoryId)?.name ||
              "",
            productName:
              productTypes.find((type) => type.id === selectedProductTypeId)
                ?.product || "",
            regions: regions as ("eu" | "uk")[],
          });
      }

      if (mode === "edit" && initialData?.id) {
        newProduct = await updateProduct.mutateAsync({
          id: initialData?.id as string,
          product: data,
        });

        // Get current question answers
        const currentQuestionIds =
          initialData?.selectedQuestions?.map((qa) => qa.question_id) || [];

        // Find questions to be removed (those that exist in current but not in newly selected ones)
        const questionsToRemove = currentQuestionIds.filter(
          (id) => !selectedQuestions.includes(id)
        );

        // Find questions to be added (those that exist in newly selected but not in current ones)
        const questionsToAdd = selectedQuestions.filter(
          (id) => !currentQuestionIds.includes(id)
        );

        // Remove questions that are no longer selected
        if (questionsToRemove.length > 0) {
          await deleteProductQuestionAnswers.mutateAsync({
            productId: initialData?.id as string,
            questionIds: questionsToRemove,
          });
        }

        // Add questions that are newly selected
        if (questionsToAdd.length > 0) {
          const questionAnswers = questionsToAdd.map((questionId) => ({
            question_id: questionId,
            answer: true,
          }));

          newProductQuestionAnswers =
            await createProductQuestionAnswers.mutateAsync({
              productId: initialData?.id as string,
              questionAnswers,
            });
        }
      }

      setInitialData({
        ...initialData,
        ...newProduct,
        selectedQuestions: newProductQuestionAnswers || [],
        ...(defaultDirectivesRegulationsStandards
          ? {
              selectedUserProductUserDirectives:
                defaultDirectivesRegulationsStandards.directives,
              selectedUserProductUserRegulations:
                defaultDirectivesRegulationsStandards.regulations,
              selectedUserProductUserStandards:
                defaultDirectivesRegulationsStandards.standards,
            }
          : {}),
      });

      onNextStep();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedManufacturerName = () => {
    if (!selectedManufacturerId) return "Select manufacturer";

    const manufacturer = manufacturers.find(
      (m) => m.id === selectedManufacturerId
    );

    return `${manufacturer?.name} (${manufacturer?.country})`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Popover
              open={openCategoryPopover}
              onOpenChange={setOpenCategoryPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCategoryPopover}
                  className="w-full justify-between"
                >
                  {selectedCategoryId
                    ? categories.find((cat) => cat.id === selectedCategoryId)
                        ?.name || "Select category"
                    : "Select category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-xs p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup heading="Categories">
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            handleCategoryChange(category.id);
                            setOpenCategoryPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategoryId === category.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_type">Product Type</Label>
            <Popover
              open={openSubcategoryPopover}
              onOpenChange={setOpenSubcategoryPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSubcategoryPopover}
                  className="w-full justify-between"
                  disabled={!selectedCategoryId}
                >
                  {selectedProductTypeId
                    ? productTypes.find(
                        (type) => type.id === selectedProductTypeId
                      )?.product || "Select product type"
                    : "Select product type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-xs p-0">
                <Command>
                  <CommandInput placeholder="Search product type..." />
                  <CommandEmpty>No product type found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup heading="Product Types">
                      {productTypes.map((productType) => (
                        <CommandItem
                          key={productType.id}
                          value={productType.product}
                          onSelect={() => {
                            handleProductTypeChange(productType.id);
                            setOpenSubcategoryPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProductTypeId === productType.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {productType.product}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

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

        {selectedCategoryId && selectedProductTypeId && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Select all relevant questions for this product:
              </p>

              <div className="grid grid-cols-1 gap-3 mt-4">
                {questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No questions available for the selected category and product
                    type.
                  </p>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-start space-x-3"
                    >
                      <Checkbox
                        id={`question-${question.id}`}
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() =>
                          handleQuestionToggle(question.id)
                        }
                      />
                      <div className="space-y-1 flex flex-col">
                        <label
                          htmlFor={`question-${question.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {question.question}
                        </label>
                        {question.question_description && (
                          <p className="text-sm text-muted-foreground">
                            {question.question_description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* Manufacturer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
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
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  {getSelectedManufacturerName()}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search manufacturer..." />
                <CommandEmpty>No manufacturer found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {manufacturers.map((manufacturer) => (
                      <CommandItem
                        key={manufacturer.id}
                        value={manufacturer.name}
                        onSelect={() => {
                          setSelectedManufacturerId(manufacturer.id);
                          setOpenManufacturerPopover(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedManufacturerId === manufacturer.id
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
              defaultValue={initialData?.specification}
              className="pl-12 bg-white min-h-[120px] text-lg resize-none"
            />
          </div>
        </div>

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
          <Popover open={openEuRepPopover} onOpenChange={setOpenEuRepPopover}>
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
          <Popover open={openUkRepPopover} onOpenChange={setOpenUkRepPopover}>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </div>
    </form>
  );
}
