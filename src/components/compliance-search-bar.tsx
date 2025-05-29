"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ComplianceSearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function ComplianceSearchBar({ className, onSearch }: ComplianceSearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestionQuestions = [
    "Is my children's toy compliant with GPSR safety standards?",
    "What documentation do I need for EU market access?",
    "Are my product labels GPSR compliant?",
    "Do I need additional testing for UK market?",
    "What are the GPSR requirements for my cosmetic product?",
    "How do I ensure my electronics meet GPSR requirements?",
    "What changes are needed for GPSR compliance by December 2024?"
  ];

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show suggestions when input is focused and either has content or user clicks the input
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setShowSuggestions(false);
  };

  return (
    <div 
      className={cn("relative w-full max-w-5xl mx-auto", className)} 
      ref={searchRef}
    >
      <form onSubmit={handleSearch}>
        <div className="flex flex-col w-full">
          <div className="relative flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                ref={inputRef}
                className="pl-12 pr-4 py-7 text-lg rounded-t-xl md:rounded-l-xl md:rounded-tr-none border-0 bg-white focus-visible:ring-primary"
                placeholder="Enter your product details for instant GPSR compliance check"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
              />
            </div>

            <div className="flex bg-white md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <input
                  type="file"
                  id="product-image"
                  className="sr-only"
                  accept="image/*"
                />
                <label
                  htmlFor="product-image"
                  className="flex items-center justify-center gap-2 h-14 px-4 cursor-pointer text-sm font-medium hover:bg-muted/20 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="whitespace-nowrap">Upload Image</span>
                </label>
              </div>

              <Link href="/compliance-checker" className="flex-1 md:flex-initial">
                <Button 
                  type="submit"
                  className="h-14 px-6 w-full rounded-b-xl md:rounded-l-none md:rounded-r-xl"
                >
                  Check Compliance Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          <div className={cn(
            "absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border overflow-hidden transition-all origin-top",
            showSuggestions 
              ? "opacity-100 scale-100 translate-y-0 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200" 
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}>
            <div className="py-1">
              {suggestionQuestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors flex items-start space-x-3 border-b last:border-b-0 border-muted/30"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}