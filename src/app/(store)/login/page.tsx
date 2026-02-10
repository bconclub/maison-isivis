import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Maison ISIVIS",
  description: "Sign in to your Maison ISIVIS account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/images/logo/ISIVIS-Icon.png"
            alt="Maison ISIVIS"
            width={48}
            height={48}
            className="mx-auto mb-4 h-12 w-auto"
          />
          <h1 className="font-heading text-h2 font-light text-neutral-800">
            Welcome Back
          </h1>
          <p className="mt-2 text-body-sm text-neutral-500">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-body-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-purple transition-colors hover:text-brand-purple-light"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
