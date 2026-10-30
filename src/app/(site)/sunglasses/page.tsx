import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Sunglasses", description: "Sunglasses for men, women, and children at R.A. Jayasinghe Opticians." };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Catalog
      category="sunglasses"
      basePath="/sunglasses"
      eyebrow="Sunglasses"
      title="Shade, with a bit of style"
      intro="Men, women, and children. There is no cart and no online payment. Buy on WhatsApp and we confirm delivery."
      searchParams={await searchParams}
    />
  );
}
