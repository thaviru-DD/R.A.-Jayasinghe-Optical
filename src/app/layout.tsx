import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ContactDock } from "@/components/ContactDock";
import { shop, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: shop.name, template: `%s · ${shop.name}` },
  description: `${shop.tagline} Eye tests, spectacles, sunglasses, contact lenses, and lenses at ${shop.address}.`,
  openGraph: {
    title: shop.name,
    description: shop.tagline,
    url: siteUrl,
    siteName: shop.name,
    locale: "en_LK",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Optician",
  name: shop.name,
  url: siteUrl,
  image: `${siteUrl}/brand/logo.png`,
  telephone: shop.phones.map((phone) => phone.tel),
  email: shop.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 327, Galle Road",
    addressLocality: "Ratmalana",
    addressCountry: "LK",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:30", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:30", closes: "13:30" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <ContactDock />
      </body>
    </html>
  );
}
