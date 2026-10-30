import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Sunglasses",
  description: "Luxury sunglasses for men, women, and children at R.A. Jayasinghe Opticians, Ratmalana.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Catalog
      category="sunglasses"
      basePath="/sunglasses"
      eyebrow="Sunglasses"
      title="Shade, worn with presence"
      intro="A curated edit for men, women, and children. Browse in store style online, then buy on WhatsApp — no cart, no online payment."
      searchParams={await searchParams}
      variant="luxury"
    />
  );
}
