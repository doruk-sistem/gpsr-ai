import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import userService, {
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
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserProfiles = (params: UserProfileListParams) => {
  return useQuery({
    queryKey: ["auth", "userProfiles", params],
    queryFn: () => userService.getUserProfiles(params),
  });
};

/**
 * If the user is not an admin or superadmin, he can only see his own data.
 */
export const useGetUserProfileById = (id: string) => {
  return useQuery({
    queryKey: ["auth", "userProfile", id],
    queryFn: () => userService.getUserProfileById(id),
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
