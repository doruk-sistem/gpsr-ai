import axios from "axios";

import { supabase } from "@/lib/supabase/client";
import supabaseHelper, {
  jsonSelect,
  SelectQuery,
} from "../utils/supabase-helper";
import { User, UserResponse } from "@supabase/supabase-js";
import stripeService from "./stripe-service";

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

export type StripeSubscriptionStatus =
  | "not_started"
  | "active"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export interface UserProfileWithStripe extends UserProfile {
  // Full stripe customer data as JSON object
  stripe_customer?: {
    id: number;
    user_id: string;
    customer_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  } | null;

  // Full stripe subscription data as JSON object
  stripe_subscription?: {
    id: number;
    customer_id: string;
    subscription_id: string | null;
    price_id: string | null;
    current_period_start: number | null;
    current_period_end: number | null;
    cancel_at_period_end: boolean | null;
    payment_method_brand: string | null;
    payment_method_last4: string | null;
    status: StripeSubscriptionStatus;
    trial_start: number | null;
    trial_end: number | null;
    is_trial_used: boolean | null;
    deleted_at: string | null;
  } | null;

  // Computed fields for convenience
  is_in_trial?: boolean | null;
  has_active_subscription?: boolean | null;
}

export interface UserProfileListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  role?: UserProfile["role"] | UserProfile["role"][];
  subscription_status?: StripeSubscriptionStatus;
  has_active_subscription?: boolean;
}

export interface UpdateUserProfileParams {
  userId: string;
  userProfileData: Partial<UserProfile>;
}

export interface GetUserProfileWithStripeByIdParams {
  select?: SelectQuery<UserProfileWithStripe>;
}

// JSON selection sonucu için özel tip
interface UserProfileWithFlattenedSubscription {
  price_id?: string;
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
  }: UserProfileListParams = {}) {
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

  /**
   * Get current user profile with stripe subscription data
   */
  public async getCurrentUserProfileWithStripe(): Promise<UserProfileWithStripe | null> {
    const { data, error } = await supabase
      .from("user_profiles_with_stripe")
      .select("*")
      .single();

    if (error) throw error;
    return data as UserProfileWithStripe;
  }

  /**
   * Get user profile with stripe data by user ID
   * If the user is not an admin or superadmin, he can only see his own data.
   */
  public async getUserProfileWithStripeById(
    userId: string,
    params: GetUserProfileWithStripeByIdParams = {}
  ): Promise<UserProfileWithStripe | null> {
    // RLS automatically handles access control:
    // - Regular users can only see their own data
    // - Admins can see all data
    const selectQuery = supabaseHelper.formatSelectQuery<UserProfileWithStripe>(
      params.select
    );

    const { data, error } = await supabase
      .from("user_profiles_with_stripe")
      .select(selectQuery)
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as unknown as UserProfileWithStripe;
  }

  /**
   * Get all users with their stripe subscription status
   * Access is controlled by RLS - only admins can see all users
   */
  public async getUsersWithStripeData({
    search,
    page,
    pageSize,
    role,
    subscription_status,
    has_active_subscription,
  }: UserProfileListParams = {}): Promise<{
    data: UserProfileWithStripe[];
    count: number | null;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    let query = supabase
      .from("user_profiles_with_stripe")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    if (role) {
      if (Array.isArray(role)) {
        query = query.in("role", role);
      } else {
        query = query.eq("role", role);
      }
    }

    // Filter by subscription status in the JSON object
    if (subscription_status) {
      query = query.eq("stripe_subscription->>status", subscription_status);
    }

    if (has_active_subscription !== undefined) {
      query = query.eq("has_active_subscription", has_active_subscription);
    }

    return supabaseHelper.getPaginationResult<UserProfileWithStripe>(query, {
      page,
      pageSize,
    });
  }

  public async getActivePlanByUserId(userId: string) {
    const userProfile = await this.getUserProfileWithStripeById(userId, {
      select: {
        stripe_subscription: jsonSelect<
          NonNullable<UserProfileWithStripe["stripe_subscription"]>
        >({
          price_id: true,
        }),
      },
    });

    if (!userProfile) return null;

    const products = await stripeService.getStripeProducts();

    if (!products) return null;

    // Data comes flattened as a result of JSON selection
    // We cast for type-safe access
    const flattenedUser =
      userProfile as unknown as UserProfileWithFlattenedSubscription;
    const priceId = flattenedUser.price_id;

    // Check both monthly and annual price IDs
    const plan = products.find(
      (product) =>
        product.priceIds.monthly === priceId ||
        product.priceIds.annual === priceId
    );

    return plan !== undefined ? plan : null;
  }

  /**
   * Get supabase user by ID
   *
   * This method is only accessible to the admin and superadmin users.
   */
  public async getSupabaseUserById(userId: string) {
    const response = await axios.get(`/api/admin/users/${userId}`);
    return response.data as User;
  }
}

const userService = new UserService();

export default userService;
