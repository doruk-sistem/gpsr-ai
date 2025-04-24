"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, FileText, Upload, CheckCircle2, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    model: "",
    reference: "",
    hasManual: false,
    hasTechnicalDoc: false,
    hasTestReports: false,
    hasRiskAssessment: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleCheckboxChange = (checked, name) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = "Product category is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here we would typically send the product data to a backend API
      // For this demo, we're just simulating a successful submission
      
      // Show success message
      toast.success("Product added successfully", {
        description: "Your product has been registered for GPSR compliance",
        duration: 3000,
      });
      
      // Redirect to document upload or back to dashboard
      setTimeout(() => {
        router.push("/upload-documents");
      }, 1000);
      
    } catch (error) {
      toast.error("Failed to add product", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Register your product for GPSR compliance</p>
            </div>
          </div>
          
          <Card className="border shadow-sm mb-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter the details of your product</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Product Name <span className="text-destructive">*</span>
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Headphones Model XYZ"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Product Description <span className="text-destructive">*</span>
                  </label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of your product, including its features, components, and intended use"
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Product Category <span className="text-destructive">*</span>
                  </label>
                  <Select 
                    onValueChange={(value) => handleSelectChange(value, "category")}
                    value={formData.category}
                  >
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics & Appliances</SelectItem>
                      <SelectItem value="toys">Toys & Children's Products</SelectItem>
                      <SelectItem value="clothing">Clothing & Textiles</SelectItem>
                      <SelectItem value="furniture">Furniture & Home Goods</SelectItem>
                      <SelectItem value="personal_care">Personal Care Products</SelectItem>
                      <SelectItem value="sports">Sports & Recreation Equipment</SelectItem>
                      <SelectItem value="automotive">Automotive Accessories</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-xs mt-1">{errors.category}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-medium">
                      Model Number
                    </label>
                    <Input 
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. XYZ-1000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="reference" className="text-sm font-medium">
                      Reference Number
                    </label>
                    <Input 
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="e.g. REF-2023-001"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-base font-medium mb-4">Available Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the documentation you have available for this product. You'll be able to upload these in the next step.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="hasManual" 
                        checked={formData.hasManual}
                        onCheckedChange={(checked) => handleCheckboxChange(checked, "hasManual")}
                      />
                      <div>
                        <label
                          htmlFor="hasManual"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          User Manual / Instructions
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Instructions for use, assembly, installation or maintenance
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="hasTechnicalDoc" 
                        checked={formData.hasTechnicalDoc}
                        onCheckedChange={(checked) => handleCheckboxChange(checked, "hasTechnicalDoc")}
                      />
                      <div>
                        <label
                          htmlFor="hasTechnicalDoc"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Technical Documentation
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Technical specifications, design files, material specifications
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="hasTestReports" 
                        checked={formData.hasTestReports}
                        onCheckedChange={(checked) => handleCheckboxChange(checked, "hasTestReports")}
                      />
                      <div>
                        <label
                          htmlFor="hasTestReports"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Test Reports
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Safety testing, compliance testing or certification reports
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="hasRiskAssessment" 
                        checked={formData.hasRiskAssessment}
                        onCheckedChange={(checked) => handleCheckboxChange(checked, "hasRiskAssessment")}
                      />
                      <div>
                        <label
                          htmlFor="hasRiskAssessment"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Risk Assessment
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Identified risks and mitigation measures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0 bg-muted/20 border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      Continue to Document Upload
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Comprehensive Compliance</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adding your product is the first step to ensuring GPSR compliance and accessing the EU market.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Document Management</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All your product documentation will be securely stored and easily accessible.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 relative top-0.5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">EU Authorized Representation</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Each registered product will be covered by our EU Authorized Representative service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}