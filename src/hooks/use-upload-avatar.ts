import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useUpdateCurrentUser } from "./use-auth";

export function useUploadAvatar() {
  const [isUploading, setIsUploading] = useState(false);
  const updateCurrentUser = useUpdateCurrentUser();

  const uploadAvatar = async (file: File) => {
    console.log("=== Avatar Upload Process Started ===");

    if (!file) {
      console.log("❌ No file provided");
      return;
    }

    console.log("📁 File Details:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      console.error("❌ File size exceeds 2MB limit");
      throw new Error("File size must be less than 2MB");
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      throw new Error(
        "Invalid file type. Allowed types: jpeg, png, jpg, gif, svg"
      );
    }

    console.log("✅ File validation passed");
    setIsUploading(true);

    try {
      // Check current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log("👤 Current user:", user?.id);

      if (userError) {
        console.error("❌ Error getting user:", userError);
        throw new Error("Failed to get user information");
      }

      if (!user) {
        console.error("❌ No authenticated user found");
        throw new Error("User not authenticated");
      }

      // Check storage buckets
      console.log("🔍 Checking storage buckets...");
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        console.error("❌ Error fetching buckets:", bucketsError);
        throw new Error("Failed to access storage buckets");
      }

      console.log(
        "📦 Available buckets:",
        buckets?.map((b) => b.name)
      );

      const avatarsBucket = buckets?.find((b) => b.name === "avatars");
      if (!avatarsBucket) {
        console.error("❌ Avatars bucket not found");
        throw new Error("Storage bucket not configured");
      }

      console.log("✅ Avatars bucket found");

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log("📤 Uploading file to Supabase:", {
        filePath,
        fileName,
        fileExt,
        bucket: "avatars",
      });

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Supabase upload error:", {
          message: uploadError.message,
          name: uploadError.name,
          error: uploadError,
        });
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("✅ File uploaded successfully:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      console.log("🔗 Generated public URL:", publicUrl);

      // Update user metadata with new avatar URL
      console.log("🔄 Updating user metadata with new avatar URL");
      await updateCurrentUser.mutateAsync({
        avatar_url: publicUrl,
      });

      console.log("✅ User metadata updated successfully");
      console.log("=== Avatar Upload Process Completed Successfully ===");
      return publicUrl;
    } catch (error) {
      console.error("❌ Error in uploadAvatar:", error);
      if (error instanceof Error) {
        throw new Error(`Avatar upload failed: ${error.message}`);
      }
      throw new Error("An unexpected error occurred during upload");
    } finally {
      setIsUploading(false);
      console.log("=== Avatar Upload Process Ended ===");
    }
  };

  return {
    uploadAvatar,
    isUploading,
  };
}
