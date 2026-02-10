"use client";

import { create } from "zustand";

interface UIState {
  // Mobile navigation
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Generic modal
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Announcement bar
  isAnnouncementVisible: boolean;
  dismissAnnouncement: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Mobile navigation
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  // Generic modal
  activeModal: null,
  modalData: null,
  openModal: (modalId, data) =>
    set({ activeModal: modalId, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Announcement bar
  isAnnouncementVisible: true,
  dismissAnnouncement: () => set({ isAnnouncementVisible: false }),
}));
