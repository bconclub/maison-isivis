import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter, Italiana } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison ISIVIS | Luxury Fashion",
    template: "%s | Maison ISIVIS",
  },
  description:
    "Handcrafted luxury fashion from our London atelier. Prêt-à-couture for the modern woman. Turning Fantasy Into Reality.",
  keywords: [
    "luxury fashion",
    "designer fashion",
    "women fashion",
    "luxury clothing",
    "Maison ISIVIS",
    "handcrafted London",
    "prêt-à-couture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${italiana.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5N92PH0W38"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5N92PH0W38');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-white font-body text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
