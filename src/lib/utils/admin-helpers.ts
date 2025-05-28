"use server";

import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Validate if the current user is an admin
 * @param supabase - The supabase client (server-side)
 * @param userId - The user id (if not provided, the current user will be used)
 * @returns true if the user is an admin, false otherwise
 */
export const isAdmin = async (
  supabase: SupabaseClient,
  userId?: string | null
): Promise<boolean> => {
  try {
    let id: string | null | undefined;

    if (!userId) {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      id = data.user?.id;
    } else {
      id = userId;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    if (!data?.role) {
      return false;
    }

    return data?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Validate if the current user is a superadmin
 * @param supabase - The supabase client (server-side)
 * @param userId - The user id (if not provided, the current user will be used)
 * @returns true if the user is a superadmin, false otherwise
 */
export const isSuperAdmin = async (
  supabase: SupabaseClient,
  userId?: string | null
): Promise<boolean> => {
  try {
    let id: string | null | undefined;

    if (!userId) {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      id = data.user?.id;
    } else {
      id = userId;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error checking superadmin status:", error);
      return false;
    }

    console.log("[isSuperAdmin] Data:", data);

    return data?.role === "superadmin";
  } catch (error) {
    console.error("Error checking superadmin status:", error);
    return false;
  }
};

/**
 * Validate if the current user is an admin or superadmin
 * @param supabase - The supabase client (server-side)
 * @param userId - User id (if not provided, the current user will be used)
 * @returns true if the user is an admin, false otherwise
 */
export async function isAdminOrSuperAdmin(
  supabase: SupabaseClient,
  userId?: string | null
): Promise<boolean> {
  try {
    let id: string | null | undefined;

    if (!userId) {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      id = data.user?.id;
    } else {
      id = userId;
    }

    const admin = await isAdmin(supabase, id);
    const superadmin = await isSuperAdmin(supabase, id);

    if (!admin && !superadmin) {
      throw new Error("User is not an admin or superadmin");
    }

    return true;
  } catch (error) {
    console.error("Error validating admin or superadmin", error);
    return false;
  }
}
