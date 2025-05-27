"use client";

import React, { createContext, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Product } from "@/lib/services/products-service";

import type { ProductQuestionAnswer } from "@/lib/services/product-question-answers-service";
import type { UserProductUserStandard } from "@/lib/services/user-product-user-standards-service";
import type { ProductTechnicalFile } from "@/lib/services/product-technical-files-service";
import type { ProductNotifiedBody } from "@/lib/services/product-notified-bodies-service";
import type { ProductCategory } from "@/lib/services/product-categories-service";
import type { ProductType } from "@/lib/services/product-types-services";
import type { Manufacturer } from "@/lib/services/manufacturers-service";
import type { UserProductUserDirective } from "@/lib/services/user-product-user-directives-service";
import type { UserProductUserRegulation } from "@/lib/services/user-product-user-regulations-service";

import ProductStep1 from "./steps/ProductStep1";
import ProductStep2 from "./steps/ProductStep2";
import ProductStep3 from "./steps/ProductStep3";
import ProductStep4 from "./steps/ProductStep4";

type ProductFormContextType = {
  initialData?: ProductFormProps["initialData"];
  setInitialData: (data: ProductFormProps["initialData"]) => void;
  onNextStep: () => void;
  mode: "create" | "edit";
} | null;

export const ProductFormContext = createContext<ProductFormContextType>(null);

export interface ProductFormProps {
  initialData?: Partial<
    Product & {
      product_categories: ProductCategory;
      product_types: ProductType;
      manufacturers: Manufacturer;
    }
  > & {
    selectedQuestions?: ProductQuestionAnswer[];
    selectedTechnicalFiles?: ProductTechnicalFile[];
    selectedNotifiedBody?: ProductNotifiedBody;
    selectedUserProductUserDirectives?: UserProductUserDirective[];
    selectedUserProductUserRegulations?: UserProductUserRegulation[];
    selectedUserProductUserStandards?: UserProductUserStandard[];
  };
  mode: "create" | "edit";
}

const STEPS = [
  {
    title: "General Information",
    description: "Provide information about the product",
    component: ProductStep1,
  },
  {
    title: "Add Documents",
    description: "Add documents to the product",
    component: ProductStep2,
  },
  {
    title: "Technical Files",
    description: "Upload technical files",
    component: ProductStep3,
  },
  {
    title: "Summary",
    description: "Review your product information",
    component: ProductStep4,
  },
];
export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const [initialDataState, setInitialDataState] = useState(initialData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = STEPS.length;

  const StepComponent = STEPS[currentStep - 1].component;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  React.useEffect(() => {
    // If the product is being edited, we need to check if the product has all the required fields
    if (mode === "edit" && initialData) {
      const {
        category_id,
        product_type_id,
        require_ce_ukca_marking,
        manufacturer_id,
        selectedQuestions,
        batch_number,
        image_urls,
        model_name,
        name,
        authorised_representative_eu_id,
        authorised_representative_uk_id,
        status,
        selectedUserProductUserRegulations,
        selectedUserProductUserStandards,
        selectedUserProductUserDirectives,
      } = initialData;

      const isFirstStepComplete =
        !!name &&
        require_ce_ukca_marking !== null &&
        !!batch_number &&
        !!model_name &&
        !!image_urls &&
        !!category_id &&
        !!product_type_id &&
        !!manufacturer_id &&
        !!selectedQuestions;

      const isSecondStepComplete =
        !!selectedUserProductUserDirectives &&
        !!selectedUserProductUserRegulations &&
        !!selectedUserProductUserStandards &&
        !!authorised_representative_eu_id &&
        !!authorised_representative_uk_id;

      const isThirdStepComplete = status === "pending";

      if (isThirdStepComplete) setCurrentStep(4);
      else if (isSecondStepComplete) setCurrentStep(3);
      else if (isFirstStepComplete) setCurrentStep(2);
    }
  }, [initialData, mode]);

  return (
    <ProductFormContext.Provider
      value={{
        initialData: initialDataState,
        setInitialData: setInitialDataState,
        mode,
        onNextStep: handleNextStep,
      }}
    >
      <Card className="border shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {currentStep}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      Add New Product - {STEPS[currentStep - 1].title}
                    </h1>
                    <p className="text-muted-foreground">
                      Step {currentStep} of {totalSteps}
                    </p>
                  </div>
                </div>

                <div>
                  {currentStep > 1 && currentStep !== 4 && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to step {currentStep - 1}
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Link href="/dashboard/products">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-8">
              <StepComponent />
            </div>
          </div>
        </CardContent>
      </Card>
    </ProductFormContext.Provider>
  );
}
