"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/user";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: () => set({ initialized: true, loading: false }),
}));

async function fetchProfile(userId: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single() as { data: any | null };

  if (data) {
    useAuthStore.getState().setProfile({
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      role: data.role as "customer" | "admin",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
  useAuthStore.getState().setInitialized();
}

export function useAuth() {
  const { user, profile, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized) return;

    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      useAuthStore.getState().setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        useAuthStore.getState().setInitialized();
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      useAuthStore.getState().setUser(newUser);
      if (newUser) {
        await fetchProfile(newUser.id);
      } else {
        useAuthStore.getState().setProfile(null);
        useAuthStore.getState().setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialized]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setProfile(null);
  };

  return { user, profile, loading, signOut };
}
