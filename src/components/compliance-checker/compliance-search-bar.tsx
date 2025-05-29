"use client";

import { useState, useRef } from "react";
import { Search, Upload, Image, X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ComplianceSearchBarProps {
  className?: string;
  onSearch?: (query: string, image?: File | null) => Promise<void>;
}

export function ComplianceSearchBar({
  className,
  onSearch,
}: ComplianceSearchBarProps) {
  const [query, setQuery] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestionQuestions = [
    "Is my children's toy compliant with GPSR safety standards?",
    "What documentation do I need for EU market access?",
    "Do I need additional testing for UK market?",
    "What are the GPSR requirements for my cosmetic product?",
    "How do I ensure my electronics meet GPSR requirements?",
    "What changes are needed for GPSR compliance by December 2024?",
  ];

  const maxLength = 250;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (query.length === 0) return;

    if (onSearch) {
      await onSearch(query, uploadedImage);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-6", className)}>
      {/* Search Bar Section */}
      <div className="relative">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden">
              {/* Search Input */}
              <div className="relative bg-white">
                <Search className="absolute left-6 top-6 text-muted-foreground h-6 w-6 z-10" />
                <textarea
                  className="w-full min-h-[80px] max-h-40 h-auto pl-16 pr-20 py-6 text-lg border-0 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none placeholder:text-muted-foreground/60 font-medium resize-none overflow-y-auto"
                  placeholder="Enter your product details for instant GPSR compliance check"
                  value={query}
                  required
                  onChange={(e) => {
                    if (e.target.value.length <= maxLength) {
                      setQuery(e.target.value);
                    }
                  }}
                  maxLength={maxLength}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height =
                      Math.min(target.scrollHeight, 160) + "px";
                  }}
                />
                {/* Character Counter */}
                {query.length > 0 && (
                  <div className="absolute right-6 top-6 text-sm text-muted-foreground/60 font-medium">
                    {query.length}/{maxLength}
                  </div>
                )}
              </div>

              {/* Upload and Button Section */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                {/* Image Upload */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {imagePreview ? (
                    <div className="relative group">
                      <div className="w-24 h-14 rounded-lg border border-primary/40 bg-primary/10 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Uploaded product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                      <div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-muted/40 hover:border-primary/50 bg-white hover:bg-primary/5 transition-all duration-200 text-sm text-muted-foreground hover:text-primary group"
                    >
                      <Image className="h-4 w-4" />
                      <span className="font-medium">Upload Image</span>
                    </button>
                  )}
                </div>

                {/* Check Compliance Button */}
                <Button
                  type="submit"
                  className="h-12 px-8 rounded-lg font-semibold text-base bg-primary hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
                >
                  Check Compliance With AI
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Most Asked Questions Section */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Most Asked Questions
        </h3>
        <div className="grid gap-3">
          {suggestionQuestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-4 py-2 rounded-xl border border-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <Search className="h-4 w-4 mt-1 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
