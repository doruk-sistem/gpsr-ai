"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase/client";

export interface CustomerActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const useAdminCustomer = (customerId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      
      try {
        // Fetch user from auth.users
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(customerId);
        
        if (userError) throw userError;
        if (!userData.user) return null;
        
        // Get products count
        const { count: productCount, error: productError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customerId);
          
        if (productError) console.error("Error fetching product count:", productError);
        
        // Get manufacturers count
        const { count: manufacturerCount, error: manufacturerError } = await supabase
          .from('manufacturers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customerId);
          
        if (manufacturerError) console.error("Error fetching manufacturer count:", manufacturerError);
        
        // Get representative requests count
        const { count: requestCount, error: requestError } = await supabase
          .from('authorised_representative_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', customerId);
          
        if (requestError) console.error("Error fetching request count:", requestError);
        
        // Mock subscription data - in a real app you'd fetch this from your database
        const subscription = userData.user.user_metadata?.package_id ? {
          status: Math.random() > 0.3 ? 'active' : 'trialing',
          is_trial: Math.random() > 0.7,
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          product_name: 'Premium Plan',
          current_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime() / 1000,
          cancel_at_period_end: false,
          payment_method: {
            brand: 'visa',
            last4: '4242',
          },
        } : undefined;
        
        // Mock activity data
        const activities: CustomerActivity[] = [
          {
            id: '1',
            type: 'Login',
            description: 'User logged in from IP 192.168.1.1',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            type: 'Product Added',
            description: 'Added new product "Wireless Headphones"',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            type: 'Manufacturer Added',
            description: 'Added new manufacturer "ElectroTech Inc."',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        return {
          ...userData.user,
          product_count: productCount || 0,
          manufacturer_count: manufacturerCount || 0,
          representative_request_count: requestCount || 0,
          subscription,
          activities,
        };
      } catch (error) {
        console.error("Error fetching admin customer:", error);
        throw error;
      }
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};