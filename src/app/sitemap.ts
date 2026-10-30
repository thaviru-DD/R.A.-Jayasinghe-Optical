import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([
    prisma.product.findMany({ where: { hidden: false }, select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticPaths = ["", "/spectacles", "/sunglasses", "/contact-lenses", "/lenses", "/book", "/contact", "/articles", "/favourites", "/search"];
  return [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path || "/"}` })),
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, lastModified: product.updatedAt })),
    ...articles.map((article) => ({ url: `${siteUrl}/articles/${article.slug}`, lastModified: article.updatedAt })),
  ];
}
