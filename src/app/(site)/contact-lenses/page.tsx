import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Contact lenses", description: "Contact lenses at R.A. Jayasinghe Opticians, Ratmalana." };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Catalog
      category="contact-lenses"
      basePath="/contact-lenses"
      eyebrow="Contact lenses"
      title="Lenses you can wear, and replace on schedule"
      intro="Each lens has photos, a price, and stock. Buy on WhatsApp. There is no cart and no online payment."
      searchParams={await searchParams}
    />
  );
}
