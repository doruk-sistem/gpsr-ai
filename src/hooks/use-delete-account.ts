import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteAccount = async () => {
    setIsDeleting(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      // Delete user's avatar from storage if exists
      if (user.user_metadata?.avatar_url) {
        const avatarPath = user.user_metadata.avatar_url.split("/").pop();
        if (avatarPath) {
          const { error: storageError } = await supabase.storage
            .from("avatars")
            .remove([avatarPath]);

          if (storageError) {
            console.error("Error deleting avatar:", storageError);
          }
        }
      }

      // Delete user's data from database
      const { error: deleteError } = await supabase
        .from("auth.users")
        .delete()
        .eq("id", user.id);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        throw deleteError;
      }

      // Sign out and redirect to home page
      await supabase.auth.signOut();
      router.push("/");
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
}
