"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onClose: () => void;
}

export function AddressForm({ initialData, onClose }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: AddressFormData) {
    // Placeholder — will connect to Supabase later
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast("Address saved (placeholder)", "success");
    console.log("Address data:", data);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Your full name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+44 7700 900000"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        label="Address Line 1"
        placeholder="Street address"
        error={errors.addressLine1?.message}
        {...register("addressLine1")}
      />

      <Input
        label="Address Line 2"
        placeholder="Apartment, suite, etc. (optional)"
        error={errors.addressLine2?.message}
        {...register("addressLine2")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="London"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="State / County"
          placeholder="Greater London"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postcode"
          placeholder="SW1A 1AA"
          error={errors.pinCode?.message}
          {...register("pinCode")}
        />
        <Input
          label="Country"
          placeholder="United Kingdom"
          error={errors.country?.message}
          {...register("country")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-luxury-md bg-brand-purple px-6 py-3 text-body-sm font-medium uppercase tracking-luxury text-white transition-all hover:bg-brand-purple-light disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-luxury-md border border-neutral-200 px-6 py-3 text-body-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
