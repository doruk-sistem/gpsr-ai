"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/api/endpoints";
import authService from "@/lib/services/auth-service";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// ------------------------- //
// ---- AUTH HOOKS ---- //
// ------------------------- //
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching initial session...");
        // Get the current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          console.log("Session found during initial check");
          setUser(sessionData.session.user as User);
        } else {
          console.log("No session found during initial check");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}, session:`, !!session);
      setUser(session?.user as User || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    data: user,
    isLoading,
  };
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: authService.updatePassword,
  });
};

export const useSignInWithGoogle = () => {
  return useMutation({
    mutationFn: authService.signInWithGoogle,
  });
};