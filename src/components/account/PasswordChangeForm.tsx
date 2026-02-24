"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setSaving(false);

    if (updateError) {
      toast(updateError.message, "error");
      return;
    }

    toast("Password updated successfully!", "success");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="mt-12 border-t border-neutral-100 pt-8">
      <h2 className="mb-6 font-heading text-h3 font-light text-neutral-800">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-body-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-luxury-md border border-brand-purple px-8 py-3 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all hover:bg-brand-purple hover:text-white disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
