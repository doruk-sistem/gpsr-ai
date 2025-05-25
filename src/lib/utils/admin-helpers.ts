import { supabase } from "../supabase/client";
import { User } from "@/lib/api/endpoints";

export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();

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
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error checking superadmin status:", error);
      return false;
    }

    return data?.role === 'superadmin';
  } catch (error) {
    console.error("Error checking superadmin status:", error);
    return false;
  }
};

export const redirectIfNotAdmin = (isAdmin: boolean, router: any) => {
  if (!isAdmin) {
    router.push('/');
  }
};