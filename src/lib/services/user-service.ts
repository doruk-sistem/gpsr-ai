import { supabase } from "@/lib/supabase/client";
import supabaseHelper from "../utils/supabase-helper";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  role: "admin" | "superadmin" | "user";
  created_at: string;
  updated_at: string;
}

export interface UserProfileListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  role?: UserProfile["role"] | UserProfile["role"][];
}

export interface UpdateUserProfileParams {
  userId: string;
  userProfileData: Partial<UserProfile>;
}

class UserService {
  public async getCurrentUserProfile() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    const { data: userProfile, error: userProfileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    if (userProfileError) throw userProfileError;
    return userProfile;
  }

  public async getCurrentUserRole() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    const { data: userProfile, error: userProfileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (userProfileError) throw userProfileError;
    return userProfile?.role as UserProfile["role"];
  }

  /**
   * If the user is not an admin or superadmin, he can only see his own data.
   */
  public async getUserProfiles({
    search,
    page,
    pageSize,
    role,
  }: UserProfileListParams) {
    const query = supabase
      .from("user_profiles")
      .select("*", { count: "exact" });

    if (search) {
      query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    if (role) {
      if (Array.isArray(role)) {
        query.in("role", role);
      } else {
        query.eq("role", role);
      }
    }

    return supabaseHelper.getPaginationResult<UserProfile>(query, {
      page,
      pageSize,
    });
  }

  /**
   * If the user is not an admin or superadmin, he can only see his own data.
   */
  public async getUserProfileById(userId: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  /**
   * If the user is not an admin or superadmin, he can only see his own data.
   */
  public async getUserRoleById(userId: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.role as UserProfile["role"];
  }

  /**
   * This method is only accessible to the admin and superadmin users.
   */
  public async updateUserProfile({
    userId,
    userProfileData,
  }: UpdateUserProfileParams) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(userProfileData)
      .eq("id", userId)
      .select();

    if (error) throw error;
    return data;
  }
}

const userService = new UserService();

export default userService;
