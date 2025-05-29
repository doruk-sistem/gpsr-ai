"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Upload, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ComplianceChecker() {
  const [query, setQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  
  const sampleQuestions = [
    "Is my children's toy compliant with GPSR safety standards?",
    "What documentation do I need for EU market access?",
    "Are my product labels GPSR compliant?",
    "Do I need additional testing for UK market?",
    "What are the GPSR requirements for my cosmetic product?"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsChecking(false);
      setShowResults(true);
    }, 2000);
  };

  const handleSampleQuestion = (question: string) => {
    setQuery(question);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 via-background to-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Instant GPSR Compliance Check
              </h1>
              <p className="text-xl text-muted-foreground mb-12">
                Reduce compliance risks by 80% - Verify EU & UK product safety requirements in seconds
              </p>

              {/* Search Form */}
              {!showResults ? (
                <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                  <CardContent className="p-0">
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col md:flex-row p-2 gap-2">
                        <div className="relative flex-grow">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-12 pr-4 py-6 text-lg rounded-lg border-0 bg-muted/30 focus-visible:ring-primary"
                            placeholder="Enter your product details for instant GPSR compliance check"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </div>

                        <div className="flex md:flex-col lg:flex-row gap-2">
                          <div className="relative">
                            <input
                              type="file"
                              id="product-image"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                            <label
                              htmlFor="product-image"
                              className="flex items-center justify-center gap-2 h-12 px-4 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer text-sm font-medium"
                            >
                              <Upload className="h-4 w-4" />
                              <span className="whitespace-nowrap">
                                {file ? file.name : "Upload Image"}
                              </span>
                            </label>
                          </div>

                          <Button 
                            type="submit" 
                            className="h-12 px-6" 
                            disabled={isChecking}
                          >
                            {isChecking ? (
                              <>Checking...</>
                            ) : (
                              <>Check Compliance Now</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>

                    {/* Sample Questions */}
                    <div className="p-4 bg-muted/10 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                        {sampleQuestions.map((question, index) => (
                          <button
                            key={index}
                            className="text-left text-sm text-muted-foreground hover:text-primary truncate transition-colors px-2 py-1 rounded-md hover:bg-muted/30"
                            onClick={() => handleSampleQuestion(question)}
                          >
                            <Search className="inline-block h-3 w-3 mr-2 text-primary" />
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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