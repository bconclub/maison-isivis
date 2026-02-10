"use client";

import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function AdminTopBar({ onToggleSidebar, sidebarOpen }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-brand-purple-10 bg-white px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-purple/60 transition-colors hover:bg-brand-purple/5 hover:text-brand-purple lg:hidden"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {sidebarOpen ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium text-brand-purple/50 sm:block">
          Maison ISIVIS Admin
        </span>
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white shadow-sm"
        )}>
          A
        </div>
      </div>
    </header>
  );
}
