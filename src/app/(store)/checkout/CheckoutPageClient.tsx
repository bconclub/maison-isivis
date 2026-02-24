"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { CartSummaryDisplay } from "@/components/cart/CartSummaryDisplay";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

const emptySubscribe = () => () => {};

const COUNTRIES = [
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "NL", label: "Netherlands" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "IN", label: "India" },
  { code: "JP", label: "Japan" },
  { code: "SG", label: "Singapore" },
  { code: "IE", label: "Ireland" },
  { code: "SE", label: "Sweden" },
  { code: "CH", label: "Switzerland" },
  { code: "NO", label: "Norway" },
  { code: "DK", label: "Denmark" },
  { code: "NZ", label: "New Zealand" },
];

export function CheckoutPageClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSummary = useCartStore((s) => s.getSummary);
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "GB",
    },
  });

  // Pre-fill form for logged-in users
  useEffect(() => {
    if (!user) return;

    // Fill from profile
    if (user.email) setValue("email", user.email);
    if (profile?.fullName) setValue("fullName", profile.fullName);
    if (profile?.phone) setValue("phone", profile.phone);

    // Fetch default address
    const supabase = createClient();
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any }) => {
        if (data) {
          setValue("addressLine1", data.address_line1);
          if (data.address_line2) setValue("addressLine2", data.address_line2);
          setValue("city", data.city);
          setValue("state", data.state);
          setValue("pinCode", data.pin_code);
          setValue("country", data.country);
        }
      });
  }, [user, profile, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast("Your bag is empty", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        shipping: data,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast(result.error || "Something went wrong", "error");
        setIsSubmitting(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast("Network error. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="container-luxury py-8 sm:py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxury py-16 text-center">
        <h1 className="font-heading text-h2 font-light text-neutral-800">
          Your bag is empty
        </h1>
        <p className="mt-3 text-body text-neutral-500">
          Add some items before checking out.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-luxury-md bg-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const summary = getSummary();

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Your Bag", href: "/cart" }, { label: "Checkout" }]}
        className="mb-6"
      />

      <h1 className="mb-8 font-heading text-h2 font-light text-neutral-800 sm:text-h1">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Left — Shipping form */}
          <div className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="mb-4 font-heading text-h4 font-light text-neutral-800">
                Contact Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="mb-4 font-heading text-h4 font-light text-neutral-800">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Smith"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />

                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+44 7700 900000"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <Input
                  label="Address Line 1"
                  placeholder="123 High Street"
                  error={errors.addressLine1?.message}
                  {...register("addressLine1")}
                />

                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="Flat 4B"
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
                    label="County / State"
                    placeholder="Greater London"
                    error={errors.state?.message}
                    {...register("state")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    placeholder="SW1A 1AA"
                    error={errors.pinCode?.message}
                    {...register("pinCode")}
                  />
                  <div className="w-full">
                    <label
                      htmlFor="country"
                      className="mb-1.5 block text-body-sm font-medium text-neutral-700"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      className="w-full rounded-luxury-md border border-neutral-200 bg-white px-4 py-3 font-body text-base text-neutral-900 transition-all duration-200 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
                      {...register("country")}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {errors.country?.message && (
                      <p className="mt-1.5 text-body-sm text-error" role="alert">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — Order summary */}
          <div>
            <div className="sticky top-28 rounded-luxury-md border border-neutral-100 p-6">
              <h2 className="mb-5 font-heading text-h4 font-light text-neutral-800">
                Order Summary
              </h2>

              {/* Items preview */}
              <div className="mb-5 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-luxury-sm bg-neutral-100">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-body-sm font-medium text-neutral-800">
                        {item.product.name}
                      </p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-caption text-neutral-400">
                          {[item.selectedSize, item.selectedColor]
                            .filter(Boolean)
                            .join(" / ")}
                        </p>
                      )}
                    </div>
                    <p className="text-body-sm font-medium text-neutral-800">
                      {formatPrice(
                        (item.product.salePrice ?? item.product.price) *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <CartSummaryDisplay />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-luxury-md bg-brand-purple px-6 py-4 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-purple/90 hover:shadow-luxury-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatPrice(summary.total)}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-caption text-neutral-400">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure checkout powered by Stripe
              </div>

              <Link
                href="/cart"
                className="mt-3 flex items-center justify-center gap-1 text-body-sm text-neutral-500 transition-colors hover:text-brand-purple"
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Return to bag
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
