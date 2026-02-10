import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Maison ISIVIS",
  description: "Create your Maison ISIVIS account and join The Queendom.",
};

export default function RegisterPage() {
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
          <h1 className="font-heading text-h2 font-semibold text-neutral-900">
            Create Account
          </h1>
          <p className="mt-2 text-body-sm text-neutral-500">
            Join The Queendom and discover luxury fashion
          </p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-body-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-purple transition-colors hover:text-brand-purple-light"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
