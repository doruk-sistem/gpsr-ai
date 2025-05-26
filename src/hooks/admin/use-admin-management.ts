"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface AdminListParams {
  search?: string;
}

export const useAdminManagement = (params: AdminListParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'admin-list', params],
    queryFn: async () => {
      try {
        let query = supabase
          .from('admins')
          .select(`
            *,
            auth_users:user_id (
              email,
              user_metadata
            )
          `);

        // Apply search filter if provided
        if (params.search) {
          query = query.or(
            `auth_users.email.ilike.%${params.search}%,auth_users.user_metadata->first_name.ilike.%${params.search}%,auth_users.user_metadata->last_name.ilike.%${params.search}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Reshape the data to match our interface
        const formattedData = data.map(admin => ({
          ...admin,
          user: admin.auth_users ? {
            email: admin.auth_users.email,
            user_metadata: admin.auth_users.user_metadata
          } : undefined
        }));
        
        return formattedData;
      } catch (error) {
        console.error("Error fetching admin list:", error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useInviteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'superadmin' }) => {
      try {
        // Generate a unique token
        const token = uuidv4();
        
        // Set expiration date (48 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);
        
        // Get the current user ID (the inviter)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Create the invitation
        const { data, error } = await supabase
          .from('admin_invitations')
          .insert({
            email,
            role,
            token,
            invited_by: user.id,
            expires_at: expiresAt.toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        // In a real application, you would send an email with the invitation link
        console.log(`Invitation link: ${window.location.origin}/admin/invitation/${token}`);

        return data;
      } catch (error) {
        console.error("Error sending admin invitation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admin-list'] });
    }
  });
};

export const useVerifyAdminInvitation = () => {
  return useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      try {
        const { data, error } = await supabase
          .from('admin_invitations')
          .select('email, role, expires_at, used_at')
          .eq('token', token)
          .single();

        if (error) {
          return { valid: false, expired: false };
        }

        const now = new Date();
        const expiresAt = new Date(data.expires_at);

        // Check if invitation is expired or already used
        if (now > expiresAt) {
          return { valid: false, expired: true };
        }

        if (data.used_at) {
          return { valid: false, expired: false };
        }

        // Invitation is valid
        return { 
          valid: true, 
          expired: false,
          email: data.email,
          role: data.role,
          expiresAt: data.expires_at
        };
      } catch (error) {
        console.error("Error verifying admin invitation:", error);
        return { valid: false, expired: false };
      }
    }
  });
};

export const useAcceptAdminInvitation = () => {
  return useMutation({
    mutationFn: async ({ token, userId }: { token: string; userId: string }) => {
      try {
        // Call the RPC function to accept the invitation
        const { data, error } = await supabase
          .rpc('use_admin_invitation', {
            token,
            user_id: userId
          });

        if (error) throw error;

        // If function returns false, something went wrong
        if (!data) {
          return { 
            success: false, 
            message: "Invalid or expired invitation" 
          };
        }

        // Success
        return { success: true };
      } catch (error: any) {
        console.error("Error accepting admin invitation:", error);
        return { 
          success: false, 
          message: error.message || "Failed to accept invitation" 
        };
      }
    }
  });
};

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adminId, role }: { adminId: string; role: 'admin' | 'superadmin' }) => {
      try {
        const { data, error } = await supabase
          .from('admins')
          .update({ 
            role,
            updated_at: new Date().toISOString()
          })
          .eq('id', adminId)
          .select()
          .single();

        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error updating admin role:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admin-list'] });
    }
  });
};

export const useRemoveAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adminId }: { adminId: string }) => {
      try {
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('id', adminId);

        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error("Error removing admin:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admin-list'] });
    }
  });
};