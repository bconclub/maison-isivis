import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vm7pgzc2sc");
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-white font-body text-neutral-900 antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
