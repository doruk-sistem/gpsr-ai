import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import userService, {
  GetUserProfileWithStripeByIdParams,
  type UpdateUserProfileParams,
  type UserProfileListParams,
} from "@/lib/services/user-service";

export const useGetCurrentUserProfile = () => {
  return useQuery({
    queryKey: ["auth", "currentUserProfile"],
    queryFn: userService.getCurrentUserProfile,
  });
};

export const useGetCurrentUserRole = () => {
  return useQuery({
    queryKey: ["auth", "currentUserRole"],
    queryFn: userService.getCurrentUserRole,
  });
};

/**
 * Get current user profile with stripe subscription data
 */
export const useGetCurrentUserProfileWithStripe = () => {
  return useQuery({
    queryKey: ["auth", "currentUserProfileWithStripe"],
    queryFn: userService.getCurrentUserProfileWithStripe,
  });
};

/**
 * Get user profile with stripe data by user ID
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserProfileWithStripeById = (
  id: string,
  params: GetUserProfileWithStripeByIdParams = {}
) => {
  return useQuery({
    queryKey: ["auth", "userProfileWithStripe", id, params],
    queryFn: () => userService.getUserProfileWithStripeById(id, params),
    enabled: !!id,
  });
};

/**
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserProfiles = (params: UserProfileListParams = {}) => {
  return useQuery({
    queryKey: ["auth", "userProfiles", params],
    queryFn: () => userService.getUserProfiles(params),
  });
};

/**
 * Get all users with their stripe subscription status
 * Access is controlled by RLS - only admins can see all users
 */
export const useGetUsersWithStripeData = (
  params: UserProfileListParams = {}
) => {
  return useQuery({
    queryKey: ["auth", "usersWithStripeData", params],
    queryFn: () => userService.getUsersWithStripeData(params),
  });
};

/**
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserProfileById = (id: string) => {
  return useQuery({
    queryKey: ["auth", "userProfile", id],
    queryFn: () => userService.getUserProfileById(id),
    enabled: !!id,
  });
};

/**
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserRoleById = (id: string) => {
  return useQuery({
    queryKey: ["auth", "userRole", id],
    queryFn: () => userService.getUserRoleById(id),
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateUserProfileParams) =>
      userService.updateUserProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth", "userProfiles"],
      });
    },
  });
};

export const useGetActivePlanByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["auth", "activePlan", userId],
    queryFn: () => userService.getActivePlanByUserId(userId),
    enabled: !!userId,
  });
};

export const useGetSupabaseUserById = (id: string) => {
  return useQuery({
    queryKey: ["auth", "supabaseUser", id],
    queryFn: () => userService.getSupabaseUserById(id),
    enabled: !!id,
  });
};
