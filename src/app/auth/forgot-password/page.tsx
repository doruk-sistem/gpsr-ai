"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here we would typically send a password reset request to a backend API
      // For this demo, we're just simulating a successful request
      
      setIsSubmitted(true);
      
      // Show success message
      toast.success("Password reset link sent", {
        description: "Please check your email inbox",
        duration: 5000,
      });
      
    } catch (error) {
      toast.error("Failed to send reset link", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="space-y-1 bg-muted/30 border-b px-6 py-5">
              <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription className="text-base">
                We'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-5 p-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Email address
                    </label>
                    <Input 
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      type="email" 
                      placeholder="john.doe@example.com" 
                      className={`h-11 rounded-lg transition-all border-input/50 focus:border-primary ${emailError ? 'border-destructive' : ''}`}
                    />
                    {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 py-5 bg-muted/20 border-t">
                  <div className="w-full space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full h-11 rounded-lg font-medium text-base shadow-sm hover:shadow transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Sending reset link...
                        </>
                      ) : (
                        'Send reset link'
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="grid gap-5 p-6 text-center">
                <div className="py-8">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button 
                      type="button" 
                      className="text-primary hover:underline font-medium"
                      onClick={() => setIsSubmitted(false)}
                    >
                      try another email address
                    </button>
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href="/login">
                    <Button variant="link" className="text-muted-foreground">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}