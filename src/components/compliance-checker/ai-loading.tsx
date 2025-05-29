"use client";

import React, { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Spinner from "../ui/spinner";

interface AILoadingProps {
  className?: string;
}

export function AILoading({ className }: AILoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    "AI is analyzing your product information...",
    "Checking compliance with GPSR regulations...",
    "Reviewing safety requirements...",
    "Cross-referencing EU standards...",
    "Preparing your comprehensive report...",
    "Almost ready with your analysis...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [loadingMessages.length]);

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="w-full max-w-lg mx-auto">
        {/* Main Loading Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
          {/* AI Brain Icon with Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Brain className="h-12 w-12 text-white animate-pulse" />
              {/* Sparkle Effects */}
              <Sparkles className="absolute top-2 right-2 h-4 w-4 text-yellow-300 animate-ping" />
              <Sparkles className="absolute bottom-2 left-2 h-3 w-3 text-blue-200 animate-ping delay-500" />
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            AI Compliance Analysis
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Our AI is working hard to analyze your product
          </p>

          {/* Spinner */}
          <div className="mb-8">
            <Spinner size="lg" className="mx-auto" />
          </div>

          {/* Rotating Messages */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-base text-gray-700 font-medium animate-pulse px-4">
              {loadingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Please wait while we process your request...
          </p>
        </div>
      </div>
    </div>
  );
}
