import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Spectacles", description: "Spectacles for men, women, and children at R.A. Jayasinghe Opticians, Ratmalana." };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Catalog
      category="spectacles"
      basePath="/spectacles"
      eyebrow="Spectacles"
      title="Frames for every face"
      intro="Browse men, women, and children. Filter by frame type, brand, shape, and price. Ask us on WhatsApp when you are ready to buy."
      searchParams={await searchParams}
    />
  );
}
