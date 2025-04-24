"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  File,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UploadDocuments() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>({
    manual: null,
    technical: null,
    testReports: null,
    riskAssessment: null,
  });

  const handleFileChange = (e: any, documentType: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles({
        ...uploadedFiles,
        [documentType]: file,
      });

      // Show success toast when file is selected
      toast.success(`File selected: ${file.name}`, {
        description: "Click continue when you're ready to proceed",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check if at least one file is uploaded
    const hasFiles = Object.values(uploadedFiles).some((file) => file !== null);

    if (!hasFiles) {
      toast.error("No documents uploaded", {
        description: "Please upload at least one document to continue",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here we would typically upload the files to a backend service
      // For this demo, we're just simulating a successful upload

      // Show success message
      toast.success("Documents uploaded successfully", {
        description: "Your product documentation has been received",
        duration: 3000,
      });

      // Redirect to sign authorization or dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileItem = (documentType: any, title: any, description: any) => {
    const file = uploadedFiles[documentType];

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">{title}</span>
          </div>
          {file ? (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Uploaded
            </span>
          ) : (
            <span className="text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-1 rounded-full">
              Optional
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3">{description}</p>

          {file ? (
            <div className="flex items-center p-3 bg-muted rounded-lg">
              <File className="h-5 w-5 text-primary mr-3" />
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => {
                  setUploadedFiles({
                    ...uploadedFiles,
                    [documentType]: null,
                  });
                }}
              >
                Replace
              </Button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer">
              <input
                type="file"
                id={`file-${documentType}`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, documentType)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Word, or image files up to 10MB
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/add-product"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to product details
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Upload Product Documentation
              </h1>
              <p className="text-muted-foreground">
                Upload your product documentation for GPSR compliance
              </p>
            </div>
          </div>

          <Card className="border shadow-sm mb-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>
                  Upload the necessary documentation for your product
                </CardDescription>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-6">
                {renderFileItem(
                  "manual",
                  "User Manual / Instructions",
                  "Upload instructions for use, assembly, installation or maintenance"
                )}

                {renderFileItem(
                  "technical",
                  "Technical Documentation",
                  "Upload technical specifications, design files, material specifications"
                )}

                {renderFileItem(
                  "testReports",
                  "Test Reports",
                  "Upload safety testing, compliance testing or certification reports"
                )}

                {renderFileItem(
                  "riskAssessment",
                  "Risk Assessment",
                  "Upload identified risks and mitigation measures"
                )}
              </CardContent>

              <CardFooter className="flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0 bg-muted/20 border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/add-product")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Continue</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="flex items-start p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium">
                Important note about documentation
              </h3>
              <p className="text-sm mt-1">
                Under the General Product Safety Regulation (GPSR), product
                documentation must be maintained for a period of 10 years. These
                documents will be kept securely in our system and may be
                required by market surveillance authorities.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
