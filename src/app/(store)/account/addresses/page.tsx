import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddressesClient } from "@/components/account/AddressesClient";
import type { Address } from "@/types/user";

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawAddresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false }) as { data: any[] | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addresses: Address[] = (rawAddresses ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    state: row.state,
    pinCode: row.pin_code,
    country: row.country,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return <AddressesClient initialAddresses={addresses} />;
}
