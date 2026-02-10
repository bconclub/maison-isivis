"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { useAdminStore, onAdminStoreHydrate } from "@/lib/stores/admin-store";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const initialize = useAdminStore((s) => s.initialize);

  useEffect(() => {
    // Wait for Zustand persist to finish rehydrating from localStorage,
    // THEN fetch real data from Supabase before showing the admin panel.
    const unsubscribe = onAdminStoreHydrate(async () => {
      await initialize();
      setReady(true);
    });
    return unsubscribe;
  }, [initialize]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-purple">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4 font-heading text-sm font-medium tracking-wide text-white/60">Loading Maison ISIVIS Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-purple-10/30">
      {/* Desktop Sidebar */}
      <AdminSidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <AdminSidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
