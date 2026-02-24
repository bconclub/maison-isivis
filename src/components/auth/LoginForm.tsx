"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Show error from callback
  const callbackError = searchParams.get("error");
  if (callbackError === "auth_callback_failed") {
    toast("Sign in failed. Please try again.", "error");
  }

  async function onSubmit(data: LoginFormData) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast("Invalid email or password. Please try again.", "error");
      } else if (error.message.includes("Email not confirmed")) {
        toast(
          "Please check your email and confirm your account first.",
          "warning"
        );
      } else {
        toast(error.message, "error");
      }
      return;
    }

    toast("Welcome back!", "success");
    router.push("/account");
    router.refresh();
  }

  async function handleForgotPassword() {
    const email = forgotEmail || watch("email");
    if (!email) {
      toast("Please enter your email address first.", "warning");
      return;
    }

    setSendingReset(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    setSendingReset(false);

    if (error) {
      toast(error.message, "error");
      return;
    }

    toast("Password reset email sent! Check your inbox.", "success");
    setShowForgotPassword(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-brand-purple accent-brand-purple"
          />
          <span className="text-body-sm text-neutral-600">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => setShowForgotPassword(!showForgotPassword)}
          className="text-body-sm font-medium text-brand-purple transition-colors hover:text-brand-purple-light"
        >
          Forgot Password?
        </button>
      </div>

      {/* Forgot Password Section */}
      {showForgotPassword && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-3 text-body-sm text-neutral-600">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={sendingReset}
              className="whitespace-nowrap rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple-light disabled:opacity-50"
            >
              {sendingReset ? "Sending..." : "Send Link"}
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury disabled:opacity-50"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

    </form>
  );
}
