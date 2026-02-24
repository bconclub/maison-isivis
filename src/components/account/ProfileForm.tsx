"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

interface ProfileFormProps {
  initialProfile: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast("You must be logged in to update your profile.", "error");
      setSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({
        full_name: fullName || null,
        phone: phone || null,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast("Failed to update profile. Please try again.", "error");
      return;
    }

    toast("Profile updated successfully!", "success");
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-5">
      <Input
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <Input
        label="Email Address"
        value={initialProfile.email}
        disabled
        helperText="Email cannot be changed"
      />

      <Input
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        type="submit"
        disabled={saving}
        className="rounded-luxury-md bg-brand-purple px-8 py-3 text-body-sm font-medium uppercase tracking-luxury text-white transition-all hover:bg-brand-purple-light hover:shadow-luxury disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
