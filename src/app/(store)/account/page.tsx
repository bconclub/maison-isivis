"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

// Mock user data
const MOCK_USER = {
  fullName: "Arabella Windsor",
  email: "arabella@example.com",
  phone: "+44 7700 900123",
};

export default function AccountProfilePage() {
  const [fullName, setFullName] = useState(MOCK_USER.fullName);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    toast("Profile updated (placeholder)", "success");
  }

  return (
    <div>
      <h2 className="mb-6 font-heading text-h3 font-light text-neutral-800">
        Profile Information
      </h2>

      <form onSubmit={handleSave} className="max-w-lg space-y-5">
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email Address"
          value={MOCK_USER.email}
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

      {/* Password Change Section */}
      <div className="mt-12 border-t border-neutral-100 pt-8">
        <h2 className="mb-6 font-heading text-h3 font-light text-neutral-800">
          Change Password
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast("Password change coming soon", "info");
          }}
          className="max-w-lg space-y-5"
        >
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            className="rounded-luxury-md border border-brand-purple px-8 py-3 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all hover:bg-brand-purple hover:text-white"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
