import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Contact lenses",
  description: "Contact lenses at R.A. Jayasinghe Opticians, Ratmalana.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Catalog
      category="contact-lenses"
      basePath="/contact-lenses"
      eyebrow="Contact lenses"
      title="Fresh lenses, fitted with care"
      intro="Browse daily and monthly options with photos, price, and stock. Buy on WhatsApp — no cart and no online payment."
      searchParams={await searchParams}
      variant="luxury"
    />
  );
}
