import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Account" }]} className="mb-6" />

      <h1 className="mb-8 font-heading text-h2 font-semibold text-neutral-900 sm:text-h1">
        My Account
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
