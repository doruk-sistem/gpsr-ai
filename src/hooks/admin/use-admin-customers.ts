"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

interface CustomersParams {
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  subscriptionStatus?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const useAdminCustomers = (params: CustomersParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: async () => {
      try {
        // Fetch users from auth.users
        let query = supabase.auth.admin.listUsers();

        const { data: usersData, error: usersError } = await query;

        if (usersError) throw usersError;
        
        if (!usersData.users || usersData.users.length === 0) {
          return [];
        }
        
        // Filter users based on search
        let filteredUsers = usersData.users;
        
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.email?.toLowerCase().includes(searchLower) ||
            user.user_metadata?.first_name?.toLowerCase().includes(searchLower) ||
            user.user_metadata?.last_name?.toLowerCase().includes(searchLower) ||
            user.user_metadata?.company?.toLowerCase().includes(searchLower)
          );
        }
        
        // For each user, get products, manufacturers and representative requests count
        const usersWithCounts = await Promise.all(filteredUsers.map(async user => {
          // Get products count
          const { count: productCount, error: productError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (productError) console.error("Error fetching product count:", productError);
          
          // Get manufacturers count
          const { count: manufacturerCount, error: manufacturerError } = await supabase
            .from('manufacturers')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (manufacturerError) console.error("Error fetching manufacturer count:", manufacturerError);
          
          // Get representative requests count
          const { count: requestCount, error: requestError } = await supabase
            .from('authorised_representative_requests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (requestError) console.error("Error fetching request count:", requestError);
          
          // Mock subscription data - in a real app you'd fetch this from your database
          const subscription = user.user_metadata?.package_id ? {
            status: Math.random() > 0.3 ? 'active' : 'trialing',
            is_trial: Math.random() > 0.7,
            trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            product_name: 'Premium Plan',
          } : undefined;
          
          return {
            ...user,
            product_count: productCount || 0,
            manufacturer_count: manufacturerCount || 0,
            representative_request_count: requestCount || 0,
            subscription,
          };
        }));
        
        // Apply subscription status filter
        let finalUsers = usersWithCounts;
        
        if (params.subscriptionStatus) {
          if (params.subscriptionStatus === 'none') {
            finalUsers = finalUsers.filter(user => !user.subscription);
          } else {
            finalUsers = finalUsers.filter(user => 
              user.subscription?.status === params.subscriptionStatus
            );
          }
        }
        
        // Apply date range filter
        if (params.dateFrom) {
          finalUsers = finalUsers.filter(user => 
            new Date(user.created_at) >= params.dateFrom!
          );
        }
        
        if (params.dateTo) {
          const dateTo = new Date(params.dateTo);
          dateTo.setHours(23, 59, 59, 999);
          finalUsers = finalUsers.filter(user => 
            new Date(user.created_at) <= dateTo
          );
        }
        
        // Apply sorting
        if (params.sort) {
          const sortField = params.sort;
          const sortOrder = params.order || 'asc';
          
          finalUsers.sort((a, b) => {
            let valueA, valueB;
            
            if (sortField === 'email') {
              valueA = a.email?.toLowerCase() || '';
              valueB = b.email?.toLowerCase() || '';
            } else if (sortField === 'created_at') {
              valueA = new Date(a.created_at).getTime();
              valueB = new Date(b.created_at).getTime();
            } else if (sortField === 'subscription.status') {
              valueA = a.subscription?.status || '';
              valueB = b.subscription?.status || '';
            } else {
              valueA = a[sortField as keyof typeof a] || '';
              valueB = b[sortField as keyof typeof b] || '';
            }
            
            if (sortOrder === 'asc') {
              return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
              return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
          });
        } else {
          // Default sort by created_at descending
          finalUsers.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        
        return finalUsers;
      } catch (error) {
        console.error("Error fetching admin customers:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};