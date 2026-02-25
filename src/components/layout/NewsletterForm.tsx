"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      toast("You're subscribed! Welcome to the family.", "success");
      setEmail("");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 rounded-luxury border border-white/15 bg-white/10 px-3.5 py-2.5 text-body-sm text-white placeholder:text-white/40 focus:border-brand-blue focus:outline-none focus:ring-[2px] focus:ring-brand-blue/20"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-luxury bg-brand-gradient px-5 py-2.5 text-caption font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-sm disabled:opacity-50"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-white/30">
        By signing up you agree to our Terms &amp; Conditions. You can
        unsubscribe at anytime you wish.
      </p>
    </form>
  );
}
