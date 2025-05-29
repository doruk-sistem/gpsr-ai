"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Shield, Upload, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ComplianceSearchBar } from "@/components/compliance-search-bar";

export default function ComplianceChecker() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  
  // Check if there's an initial query from URL params
  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsChecking(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 via-background to-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Instant GPSR Compliance Check
              </h1>
              <p className="text-xl text-muted-foreground mb-12">
                Reduce compliance risks by 80% - Verify EU & UK product safety requirements in seconds
              </p>

              {/* Search Form */}
              {!showResults ? (
                <ComplianceSearchBar 
                  onSearch={handleSearch} 
                />
              ) : (
                <ComplianceResults query={query} onReset={() => setShowResults(false)} />
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                <p className="text-muted-foreground">
                  Get immediate insights into your product's GPSR compliance status with our AI-powered analysis system.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Check</h3>
                <p className="text-muted-foreground">
                  Our system checks against all relevant GPSR requirements, EU directives, and UK regulations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Identify potential compliance gaps and get actionable recommendations to address them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready for full GPSR compliance?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Get complete compliance services including EU Authorized Representative, technical documentation, and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ComplianceResults({ query, onReset }: { query: string, onReset: () => void }) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-left animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">GPSR Compliance Analysis</h2>
          <p className="text-sm text-muted-foreground">Results for: {query}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Potential Compliance Gap</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your product description, it appears you may need additional technical documentation to meet GPSR requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Compliant Elements</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your product appears to meet basic safety requirements under Article 5 of the GPSR.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Required Actions</h3>
              <ul className="text-sm text-muted-foreground mt-1 list-disc ml-5 space-y-1">
                <li>Complete technical documentation</li>
                <li>Verify product labeling compliance</li>
                <li>Conduct risk assessment</li>
                <li>Appoint an EU Authorized Representative</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg border">
        <p className="text-sm font-medium mb-2">For a comprehensive compliance assessment:</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => router.push('/auth/register')} className="flex-grow">
            Create Free Account
          </Button>
          <Button variant="outline" onClick={onReset} className="flex-grow">
            Check Another Product
          </Button>
        </div>
      </div>
    </div>
  );
}