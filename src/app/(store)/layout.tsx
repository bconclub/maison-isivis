import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import { ToastProvider } from "@/components/ui/Toast";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <CartDrawer />
      <SearchModal />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ToastProvider />
    </>
  );
}
