"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AddressForm } from "@/components/account/AddressForm";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import type { Address } from "@/types/user";
import type { AddressFormData } from "@/lib/validations";

interface AddressesClientProps {
  initialAddresses: Address[];
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingAddress(null);
  }

  async function handleSave(data: AddressFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast("You must be logged in.", "error");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbData: any = {
      user_id: user.id,
      full_name: data.fullName,
      phone: data.phone,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      pin_code: data.pinCode,
      country: data.country,
    };

    if (editingAddress) {
      // Update existing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("addresses") as any)
        .update(dbData)
        .eq("id", editingAddress.id)
        .eq("user_id", user.id);

      if (error) {
        toast("Failed to update address.", "error");
        return;
      }

      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
                ...a,
                fullName: data.fullName,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2 || null,
                city: data.city,
                state: data.state,
                pinCode: data.pinCode,
                country: data.country,
              }
            : a
        )
      );
      toast("Address updated!", "success");
    } else {
      // Create new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newRow, error } = await supabase
        .from("addresses")
        .insert(dbData)
        .select()
        .single() as { data: any | null; error: any };

      if (error || !newRow) {
        toast("Failed to save address.", "error");
        return;
      }

      const newAddress: Address = {
        id: newRow.id,
        userId: newRow.user_id,
        fullName: newRow.full_name,
        phone: newRow.phone,
        addressLine1: newRow.address_line1,
        addressLine2: newRow.address_line2,
        city: newRow.city,
        state: newRow.state,
        pinCode: newRow.pin_code,
        country: newRow.country,
        isDefault: newRow.is_default,
        createdAt: newRow.created_at,
        updatedAt: newRow.updated_at,
      };
      setAddresses((prev) => [...prev, newAddress]);
      toast("Address added!", "success");
    }

    router.refresh();
  }

  async function handleDelete(addressId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) {
      toast("Failed to delete address.", "error");
      return;
    }

    setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    toast("Address deleted.", "success");
    router.refresh();
  }

  async function handleSetDefault(addressId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Unset all defaults first, then set the new one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("addresses") as any)
      .update({ is_default: false })
      .eq("user_id", user.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("addresses") as any)
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", user.id);

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }))
    );
    toast("Default address updated.", "success");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-h3 font-light text-neutral-800">
          Saved Addresses
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-luxury-md bg-brand-purple px-4 py-2.5 text-caption font-medium uppercase tracking-luxury text-white transition-all hover:bg-brand-purple-light"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="mb-8 rounded-luxury-md border border-neutral-100 p-5">
          <h3 className="mb-4 font-heading text-h4 font-light text-neutral-800">
            {editingAddress ? "Edit Address" : "New Address"}
          </h3>
          <AddressForm
            initialData={
              editingAddress
                ? {
                    fullName: editingAddress.fullName,
                    phone: editingAddress.phone,
                    addressLine1: editingAddress.addressLine1,
                    addressLine2: editingAddress.addressLine2 ?? undefined,
                    city: editingAddress.city,
                    state: editingAddress.state,
                    pinCode: editingAddress.pinCode,
                    country: editingAddress.country,
                  }
                : undefined
            }
            onClose={handleCloseForm}
            onSave={handleSave}
          />
        </div>
      )}

      {/* Address cards */}
      {addresses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-body-sm text-neutral-500">
            No addresses saved yet. Add one to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-luxury-md border border-neutral-100 p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <p className="text-body-sm font-medium text-neutral-900">
                  {address.fullName}
                </p>
                {address.isDefault && (
                  <Badge variant="primary">Default</Badge>
                )}
              </div>
              <div className="text-body-sm text-neutral-600">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.pinCode}
                </p>
                <p>{address.country}</p>
                <p className="mt-1">{address.phone}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-body-sm font-medium text-brand-purple transition-colors hover:text-brand-purple-light"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-body-sm text-neutral-500 transition-colors hover:text-brand-purple"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-body-sm text-neutral-400 transition-colors hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
