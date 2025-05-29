import React, { useState, useTransition } from "react";
import axios from "axios";

import { ComplianceSearchBar } from "./compliance-search-bar";
import ComplianceResults from "./compliance-results";
import { AILoading } from "./ai-loading";

export default function ComplianceChecker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (searchQuery: string, image?: File | null) => {
    startTransition(async () => {
      try {
        setQuery(searchQuery);
        setIsChecking(true);

        const formData = new FormData();
        formData.append("prompt", searchQuery);
        if (image) {
          formData.append("image", image);
        }

        const response = await axios.post("/api/check-compliance", formData);

        setResults(response.data?.content);
        setIsChecking(false);
        setShowResults(true);
      } catch (error) {
        console.error("Error checking compliance:", error);
        setIsChecking(false);
      }
    });
  };

  const resetToSearch = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen transition-all duration-500 ease-in-out">
      {/* Loading State */}
      {isPending && (
        <div className="animate-in fade-in-0 duration-500">
          <AILoading />
        </div>
      )}

      {/* Results State */}
      {showResults && !isPending && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <ComplianceResults
            query={query}
            results={results}
            onReset={resetToSearch}
          />
        </div>
      )}

      {/* Search State */}
      {!showResults && !isPending && (
        <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <ComplianceSearchBar onSearch={handleSearch} />
        </div>
      )}
    </div>
  );
}
