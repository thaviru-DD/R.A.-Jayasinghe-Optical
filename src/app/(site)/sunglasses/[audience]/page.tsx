import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { audiences } from "@/lib/site";

export function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
  return params.then(({ audience }) => ({ title: `${audience[0]?.toUpperCase()}${audience.slice(1)} sunglasses` }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ audience: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { audience } = await params;
  const match = audiences.find((item) => item.slug === audience);
  if (!match) notFound();
  return (
    <Catalog
      category="sunglasses"
      audience={audience}
      basePath={`/sunglasses/${audience}`}
      eyebrow="Sunglasses"
      title={`${match.label}'s sunglasses`}
      intro={`Sunglasses for ${match.label.toLowerCase()}. Filter by frame type, brand, shape, and price.`}
      searchParams={await searchParams}
    />
  );
}
