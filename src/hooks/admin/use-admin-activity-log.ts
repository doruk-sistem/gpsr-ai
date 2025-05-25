"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface AdminActivityLog {
  id: string;
  activity_type: string;
  message: string;
  timestamp: string;
  is_important: boolean;
}

export const useAdminActivityLog = (limit: number = 10) => {
  // This would normally fetch real data from the API
  // For demo purposes, we'll use mock data

  return useQuery({
    queryKey: ["admin", "activity-log", limit],
    queryFn: async () => {
      try {
        // In a real app, you would fetch this data from an API
        // For demonstration, we'll return mock data

        const activities: AdminActivityLog[] = [
          {
            id: "1",
            activity_type: "rep_request",
            message:
              "New representative request from <strong>TechGadgets Inc.</strong>",
            timestamp: new Date().toISOString(),
            is_important: true,
          },
          {
            id: "2",
            activity_type: "login",
            message:
              "Admin user <strong>admin@dorukwell.com</strong> logged in",
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            is_important: false,
          },
          {
            id: "3",
            activity_type: "product",
            message:
              "New product <strong>Wireless Headphones XYZ</strong> added by <strong>ElectroGlobal Ltd.</strong>",
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            is_important: false,
          },
          {
            id: "4",
            activity_type: "rep_request",
            message:
              "Representative request approved for <strong>FashionBrands GmbH</strong>",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            is_important: false,
          },
          {
            id: "5",
            activity_type: "user",
            message:
              "New customer registered: <strong>jane.smith@example.com</strong>",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            is_important: false,
          },
        ];

        return activities.slice(0, limit);
      } catch (error) {
        console.error("Error fetching admin activity log:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
