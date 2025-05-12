import React from "react";
import { cn } from "@/lib/utils/cn";
import { cva } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-primary",
  {
    variants: {
      size: {
        default: "h-8 w-8",
        sm: "h-5 w-5",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export default function Spinner({
  className,
  size,
}: {
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  return <div className={cn(spinnerVariants({ size, className }))}></div>;
}
