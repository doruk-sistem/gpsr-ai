"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Show loading toast
        toast.loading("Logging out...");
        
        // Call the logout mutation
        await logout.mutateAsync();
        
        // Clear any additional storage if needed
        localStorage.removeItem("supabaseSession");
        sessionStorage.clear();
        
        // Show success message
        toast.success("Logged out successfully", {
          description: "You have been safely logged out of your account"
        });
        
        // Redirect to home page
        setTimeout(() => {
          router.push("/");
          router.refresh(); // Force refresh to ensure navigation state is updated
        }, 1000);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Logout failed", {
          description: "Please try again or contact support if the issue persists"
        });
        
        // Even if there's an error, try to redirect to the home page
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    };

    performLogout();
  }, [router, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-8" />
          <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
          <p className="text-muted-foreground">
            Please wait while we securely log you out...
          </p>
        </div>
      </div>
    </div>
  );
}