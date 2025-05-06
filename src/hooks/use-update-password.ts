import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useUpdatePassword() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setIsUpdating(true);

    try {
      // First, verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updatePassword,
    isUpdating,
  };
}
