"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RequestSuccessPage() {
  return (
    <div className="flex items-center justify-center bg-muted/30">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-10 px-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="inline-block bg-green-100 rounded-full p-3 mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">
              Thank You for Submitting Your Details!
            </h1>
          </div>

          <div className="text-center space-y-3 mb-10">
            <p className="text-lg">
              Your information has been successfully received. Our compliance
              team will carefully review the details provided. Within 24 hours
              (Monday to Friday), you will receive:
            </p>
          </div>

          <div className="space-y-4 w-full mb-5">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">1</span>
              </div>
              <p className="text-lg pt-0.5">
                The service agreement for review and signing.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">2</span>
              </div>
              <p className="text-lg pt-0.5">
                A quotation for the Authorised Representative (AR) services.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">3</span>
              </div>
              <p className="text-lg pt-0.5">
                A payment link to complete the purchase.
              </p>
            </div>
          </div>

          <div className="text-center text-muted-foreground mb-5 max-w-md">
            <p>
              If we need any additional information, we will reach out to you
              via the contact details provided.
            </p>
          </div>

          <Link href="/dashboard/representative">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
