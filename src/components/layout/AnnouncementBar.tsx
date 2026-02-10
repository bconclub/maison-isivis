"use client";

import { useUIStore } from "@/lib/stores/ui-store";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/constants";

export function AnnouncementBar() {
  const { isAnnouncementVisible } = useUIStore();

  if (!isAnnouncementVisible) return null;

  // Build the marquee string with wide bullet separators
  const marqueeContent = ANNOUNCEMENT_MESSAGES.join("        \u2022        ");
  const fullText = `${marqueeContent}        \u2022        `;

  return (
    <div className="relative overflow-hidden bg-brand-blue-20">
      <div className="flex py-2">
        <div className="animate-marquee flex shrink-0 items-center whitespace-nowrap">
          <span className="text-caption font-medium uppercase tracking-luxury-wide text-brand-purple">
            {fullText}
          </span>
        </div>
        <div
          className="animate-marquee flex shrink-0 items-center whitespace-nowrap"
          aria-hidden="true"
        >
          <span className="text-caption font-medium uppercase tracking-luxury-wide text-brand-purple">
            {fullText}
          </span>
        </div>
      </div>
    </div>
  );
}
