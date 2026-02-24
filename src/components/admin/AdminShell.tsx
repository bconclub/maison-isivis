"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { useAdminStore, onAdminStoreHydrate } from "@/lib/stores/admin-store";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "isivis2025";
const AUTH_KEY = "isivis-admin-auth";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true");
      onLogin();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient">
      <div className="w-full max-w-sm rounded-luxury-md bg-white p-8 shadow-luxury-lg">
        <div className="mb-8 text-center">
          <Image
            src="/images/logo/ISIVIS-Icon.png"
            alt="Maison ISIVIS"
            width={48}
            height={48}
            className="mx-auto h-12 w-12"
          />
          <h1 className="mt-4 font-heading text-h3 font-light text-neutral-800">
            Admin Panel
          </h1>
          <p className="mt-1 text-caption text-neutral-500">
            Enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className="w-full rounded-luxury-md border border-neutral-200 bg-white px-4 py-3 font-body text-base text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-body-sm text-red-500">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const initialize = useAdminStore((s) => s.initialize);

  useEffect(() => {
    // Check if already authenticated in this session
    if (sessionStorage.getItem(AUTH_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    // Wait for Zustand persist to finish rehydrating from localStorage,
    // THEN fetch real data from Supabase before showing the admin panel.
    const unsubscribe = onAdminStoreHydrate(async () => {
      await initialize();
      setReady(true);
    });
    return unsubscribe;
  }, [initialize, authenticated]);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

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
