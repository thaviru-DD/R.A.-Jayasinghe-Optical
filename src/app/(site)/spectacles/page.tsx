import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = {
  title: "Spectacles",
  description: "Luxury spectacles for men, women, and children at R.A. Jayasinghe Opticians, Ratmalana.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Catalog
      category="spectacles"
      basePath="/spectacles"
      eyebrow="Spectacles"
      title="Frames chosen with care"
      intro="A refined edit for men, women, and children. Filter by frame, brand, shape, and price — then message us on WhatsApp to buy. No cart, no online payment."
      searchParams={await searchParams}
      variant="luxury"
    />
  );
}
