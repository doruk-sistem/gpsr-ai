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

  if (
    isProductLoading ||
    isProductQuestionAnswersLoading ||
    isProductDirectivesLoading ||
    isProductRegulationsLoading ||
    isUserProductUserStandardsLoading
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
        selectedQuestions: productQuestionAnswers || [],
        selectedDirectives: productDirectives || [],
        selectedRegulations: productRegulations || [],
        selectedStandards: userProductUserStandards || [],
      }}
    />
  );
}
