"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Product } from "@/lib/services/products-service";

import type { ProductQuestionAnswer } from "@/lib/services/product-question-answers-service";
import type { ProductDirective } from "@/lib/services/product-directives-service";
import type { ProductRegulation } from "@/lib/services/product-regulations-service";
import type { UserProductUserStandard } from "@/lib/services/user-product-user-standards-service";

import ProductBasicInfoStep from "./steps/ProductBasicInfoStep";
import ProductComplianceStep from "./steps/ProductComplianceStep";

export interface ProductFormProps {
  initialData?: Partial<Product> & {
    selectedQuestions?: ProductQuestionAnswer[];
    selectedDirectives?: ProductDirective[];
    selectedRegulations?: ProductRegulation[];
    selectedStandards?: UserProductUserStandard[];
  };
  mode: "create" | "edit";
}

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const [initialDataState, setInitialDataState] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

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
        specification,
      } = initialData;

      const isFirstStepComplete =
        name &&
        require_ce_ukca_marking !== null &&
        batch_number &&
        model_name &&
        image_urls &&
        specification &&
        category_id &&
        product_type_id &&
        manufacturer_id &&
        selectedQuestions;

      if (isFirstStepComplete) {
        setCurrentStep(2);
      }
    }
  }, [initialData, mode]);

  return (
    <div>
      <Card className="border shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {currentStep}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {initialData ? "Edit Product" : "Add New Product"}
                  </h1>
                  <p className="text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-8">
              {currentStep === 1 && (
                <ProductBasicInfoStep
                  initialData={initialDataState}
                  setInitialData={setInitialDataState}
                  onNextStep={handleNextStep}
                  mode={mode}
                />
              )}
              {currentStep === 2 && (
                <ProductComplianceStep
                  initialData={initialDataState}
                  setInitialData={setInitialDataState}
                  onNextStep={handleNextStep}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 space-x-2 flex justify-end">
              {currentStep > 1 && (
                <Button variant="outline" type="button" onClick={handleBack}>
                  Back
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
        </CardContent>
      </Card>
    </div>
  );
}
