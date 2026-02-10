"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";

export function PromoCodeInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast("Please enter a promo code", "error");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    // Placeholder — always "invalid" for now
    toast("Invalid promo code", "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Promo code"
        className="h-10 flex-1 rounded-luxury-md border border-neutral-200 bg-white px-3 text-body-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
      />
      <button
        type="submit"
        disabled={loading}
        className="h-10 rounded-luxury-md border border-brand-purple px-4 text-body-sm font-medium text-brand-purple transition-all hover:bg-brand-purple hover:text-white disabled:opacity-50"
      >
        {loading ? "..." : "Apply"}
      </button>
    </form>
  );
}
