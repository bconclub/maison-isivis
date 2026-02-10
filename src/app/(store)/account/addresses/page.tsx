"use client";

import { useState } from "react";
import { MOCK_ADDRESSES } from "@/lib/mock-data";
import { AddressForm } from "@/components/account/AddressForm";
import { Badge } from "@/components/ui/Badge";
import type { Address } from "@/types/user";

export default function AddressesPage() {
  const [addresses] = useState<Address[]>(MOCK_ADDRESSES);
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
                <button className="text-body-sm text-neutral-400 transition-colors hover:text-red-500">
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
