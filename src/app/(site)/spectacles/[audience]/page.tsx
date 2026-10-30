import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { audiences, labelize } from "@/lib/site";

export function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
  return params.then(({ audience }) => ({ title: `${labelize(audience)} spectacles` }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ audience: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { audience } = await params;
  if (!audiences.some((item) => item.slug === audience)) notFound();
  const label = audiences.find((item) => item.slug === audience)?.label ?? "Frames";
  return (
    <Catalog
      category="spectacles"
      audience={audience}
      basePath={`/spectacles/${audience}`}
      eyebrow="Spectacles"
      title={`${label}'s frames`}
      intro={`Spectacles for ${label.toLowerCase()}, with filters for frame type, brand, shape, and price.`}
      searchParams={await searchParams}
    />
  );
}
