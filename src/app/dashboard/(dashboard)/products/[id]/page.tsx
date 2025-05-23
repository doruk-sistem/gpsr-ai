"use client";

import React from "react";
import { useParams } from "next/navigation";

import ProductForm from "@/components/products/ProductForm";

import Spinner from "@/components/ui/spinner";

import { useProduct } from "@/hooks/use-products";
import { useProductQuestionAnswers } from "@/hooks/use-product-question-answers";
import { useProductDirectives } from "@/hooks/use-product-directives";
import { useProductRegulations } from "@/hooks/use-product-regulations";
import { useUserProductUserStandards } from "@/hooks/use-user-product-user-standards";
import { useProductTechnicalFiles } from "@/hooks/use-product-technical-files";
import { useProductNotifiedBodies } from "@/hooks/use-product-notified-bodies";

export default function EditProductPage() {
  const { id } = useParams();

  const { data: product, isLoading: isProductLoading } = useProduct(
    id as string
  );
  const {
    data: productQuestionAnswers,
    isLoading: isProductQuestionAnswersLoading,
  } = useProductQuestionAnswers(id as string);
  const { data: productDirectives, isLoading: isProductDirectivesLoading } =
    useProductDirectives(id as string);
  const { data: productRegulations, isLoading: isProductRegulationsLoading } =
    useProductRegulations(id as string);
  const {
    data: userProductUserStandards,
    isLoading: isUserProductUserStandardsLoading,
  } = useUserProductUserStandards(id as string);
  const {
    data: productTechnicalFiles,
    isLoading: isProductTechnicalFilesLoading,
  } = useProductTechnicalFiles(id as string);
  const {
    data: productNotifiedBodies,
    isLoading: isProductNotifiedBodiesLoading,
  } = useProductNotifiedBodies(id as string);

  if (
    isProductLoading ||
    isProductQuestionAnswersLoading ||
    isProductDirectivesLoading ||
    isProductRegulationsLoading ||
    isUserProductUserStandardsLoading ||
    isProductTechnicalFilesLoading ||
    isProductNotifiedBodiesLoading
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductForm
      mode="edit"
      initialData={{
        ...product,
        selectedQuestions:
          Array.isArray(productQuestionAnswers) &&
          productQuestionAnswers?.length > 0
            ? productQuestionAnswers
            : undefined,
        selectedDirectives:
          Array.isArray(productDirectives) && productDirectives?.length > 0
            ? productDirectives
            : undefined,
        selectedRegulations:
          Array.isArray(productRegulations) && productRegulations?.length > 0
            ? productRegulations
            : undefined,
        selectedStandards:
          Array.isArray(userProductUserStandards) &&
          userProductUserStandards?.length > 0
            ? userProductUserStandards
            : undefined,
        selectedTechnicalFiles:
          Array.isArray(productTechnicalFiles) &&
          productTechnicalFiles?.length > 0
            ? productTechnicalFiles
            : undefined,
        selectedNotifiedBody: productNotifiedBodies || undefined,
      }}
    />
  );
}
