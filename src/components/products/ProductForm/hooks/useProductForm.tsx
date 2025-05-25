import { useContext } from "react";
import { ProductFormContext } from "../index";

export function useProductForm() {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error("useProductForm must be used within a ProductFormProvider");
  }
  return context;
}
