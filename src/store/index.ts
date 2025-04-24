"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";
type DashboardLayout = "default" | "compact" | "analytics" | "minimal";

interface AppState {
  // Theme state
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Dashboard state
  currentDashboard: DashboardLayout;
  setCurrentDashboard: (layout: DashboardLayout) => void;

  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme state
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Dashboard state
      currentDashboard: "default",
      setCurrentDashboard: (currentDashboard) => set({ currentDashboard }),

      // Sidebar state
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        theme: state.theme,
        currentDashboard: state.currentDashboard,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
