import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";
import { User } from "@/lib/api/endpoints";

export const isAdmin = async (
  user: User | null,
  supabaseClient?: SupabaseClient
): Promise<boolean> => {
  if (!user) return false;

  console.log("Checking admin status for user:", user.id);

  try {
    const supabaseInstance = supabaseClient || supabase;

    const { data, error } = await supabaseInstance
      .from("admins")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const isSuperAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from("admins")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking superadmin status:", error);
      return false;
    }

    return data?.role === "superadmin";
  } catch (error) {
    console.error("Error checking superadmin status:", error);
    return false;
  }
};

export const redirectIfNotAdmin = (isAdmin: boolean, router: any) => {
  if (!isAdmin) {
    router.push("/");
  }
};
