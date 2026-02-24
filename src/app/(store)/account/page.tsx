import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordChangeForm } from "@/components/account/PasswordChangeForm";

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: any | null };

  return (
    <div>
      <h2 className="mb-6 font-heading text-h3 font-light text-neutral-800">
        Profile Information
      </h2>

      <ProfileForm
        initialProfile={{
          fullName: profile?.full_name ?? "",
          email: user.email ?? "",
          phone: profile?.phone ?? "",
        }}
      />

      <PasswordChangeForm />
    </div>
  );
}
