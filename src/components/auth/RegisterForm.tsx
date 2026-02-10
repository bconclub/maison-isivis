"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    // Placeholder — will connect to Supabase auth later
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast("Registration functionality coming soon", "info");
    console.log("Register data:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        type="text"
        placeholder="Your full name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Minimum 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-purple accent-brand-purple"
          required
        />
        <span className="text-body-sm text-neutral-600">
          I agree to the{" "}
          <a
            href="/terms"
            className="font-medium text-brand-purple hover:underline"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="font-medium text-brand-purple hover:underline"
          >
            Privacy Policy
          </a>
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
