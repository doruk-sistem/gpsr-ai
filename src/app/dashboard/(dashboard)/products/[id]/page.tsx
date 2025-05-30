"use client";

import React from "react";
import { useParams } from "next/navigation";

import ProductForm from "@/components/products/ProductForm";

import Spinner from "@/components/ui/spinner";

import { useProductById } from "@/hooks/use-products";
import { useProductQuestionAnswers } from "@/hooks/use-product-question-answers";
import { useUserProductUserStandards } from "@/hooks/use-user-product-user-standards";
import { useGetProductTechnicalFilesByProductId } from "@/hooks/use-product-technical-files";
import { useProductNotifiedBody } from "@/hooks/use-product-notified-bodies";
import { useUserProductUserDirectives } from "@/hooks/use-user-product-user-directives";
import { useUserProductUserRegulations } from "@/hooks/use-user-product-user-regulations";

export default function EditProductPage() {
  const { id } = useParams();

  const { data: product, isLoading: isProductLoading } = useProductById(
    id as string,
    {
      select: {
        "*": true,
        product_categories: "*",
        product_types: "*",
        manufacturers: "*",
      },
    }
  );
  const {
    data: productQuestionAnswers,
    isLoading: isProductQuestionAnswersLoading,
  } = useProductQuestionAnswers(id as string);
  const {
    data: productTechnicalFiles,
    isLoading: isProductTechnicalFilesLoading,
  } = useGetProductTechnicalFilesByProductId(id as string);
  const {
    data: productNotifiedBodies,
    isLoading: isProductNotifiedBodiesLoading,
  } = useProductNotifiedBody(id as string);
  const {
    data: productUserProductUserDirectives,
    isLoading: isProductUserProductUserDirectivesLoading,
  } = useUserProductUserDirectives(id as string);
  const {
    data: productUserProductUserRegulations,
    isLoading: isProductUserProductUserRegulationsLoading,
  } = useUserProductUserRegulations(id as string);
  const {
    data: userProductUserStandards,
    isLoading: isUserProductUserStandardsLoading,
  } = useUserProductUserStandards(id as string);

  if (
    isProductLoading ||
    isProductQuestionAnswersLoading ||
    isProductTechnicalFilesLoading ||
    isProductNotifiedBodiesLoading ||
    isUserProductUserStandardsLoading ||
    isProductUserProductUserDirectivesLoading ||
    isProductUserProductUserRegulationsLoading
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
        selectedTechnicalFiles:
          Array.isArray(productTechnicalFiles) &&
          productTechnicalFiles?.length > 0
            ? productTechnicalFiles
            : undefined,
        selectedNotifiedBody: productNotifiedBodies || undefined,
        selectedUserProductUserStandards:
          Array.isArray(userProductUserStandards) &&
          userProductUserStandards?.length > 0
            ? userProductUserStandards
            : undefined,
        selectedUserProductUserDirectives:
          Array.isArray(productUserProductUserDirectives) &&
          productUserProductUserDirectives?.length > 0
            ? productUserProductUserDirectives
            : undefined,
        selectedUserProductUserRegulations:
          Array.isArray(productUserProductUserRegulations) &&
          productUserProductUserRegulations?.length > 0
            ? productUserProductUserRegulations
            : undefined,
      }}
    />
  );
}
