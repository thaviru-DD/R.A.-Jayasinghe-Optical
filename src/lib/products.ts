import type { Product } from "@prisma/client";
import { prisma } from "@/lib/db";
import { parseImages, salePrice, visiblePrice } from "@/lib/format";
import { shop, siteUrl } from "@/lib/site";

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountType: string | null;
  discountValue: number | null;
  showDiscount: boolean;
  category: string;
  audience: string | null;
  frameType: string | null;
  shape: string | null;
  inStock: boolean;
  featured: boolean;
  images: string[];
};

export function toPublic(product: Product): PublicProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    price: product.price,
    discountType: product.discountType,
    discountValue: product.discountValue,
    showDiscount: product.showDiscount,
    category: product.category,
    audience: product.audience,
    frameType: product.frameType,
    shape: product.shape,
    inStock: product.inStock,
    featured: product.featured,
    images: parseImages(product.images),
  };
}

export function buyMessage(product: PublicProduct, path: string, origin = siteUrl) {
  const sale = salePrice(product);
  const price = sale != null ? `${formatMoney(sale)} (was ${formatMoney(product.price)})` : formatMoney(product.price);
  const stock = product.inStock ? "In stock" : "Out of stock";
  return [
    `Hello ${shop.name}, I would like to buy this product:`,
    `Name: ${product.name}`,
    `Brand: ${product.brand}`,
    `Price: ${price}`,
    `Stock: ${stock}`,
    `Link: ${origin}${path}`,
  ].join("\n");
}

function formatMoney(value: number) {
  return `Rs. ${Math.round(value).toLocaleString("en-LK")}`;
}

export async function queryProducts(filters: {
  category?: string;
  audience?: string;
  frameType?: string;
  shape?: string;
  brand?: string;
  min?: number;
  max?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  const pageSize = filters.pageSize ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const rows = await prisma.product.findMany({
    where: {
      hidden: false,
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.audience ? { audience: filters.audience } : {}),
    },
    orderBy: { name: "asc" },
  });

  const brands = [...new Set(rows.map((row) => row.brand))].sort((a, b) => a.localeCompare(b));
  const q = filters.q?.trim().toLowerCase();
  const filtered = rows.filter((row) => {
    const product = toPublic(row);
    if (filters.frameType && product.frameType !== filters.frameType) return false;
    if (filters.shape && product.shape !== filters.shape) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    const price = visiblePrice(product);
    if (filters.min != null && price < filters.min) return false;
    if (filters.max != null && price > filters.max) return false;
    if (q && !product.name.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) return false;
    return true;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize).map(toPublic);
  return { items, total: filtered.length, pages, page: safePage, brands };
}

export async function getProduct(slug: string) {
  const product = await prisma.product.findFirst({ where: { slug, hidden: false } });
  return product ? toPublic(product) : null;
}

export async function relatedProducts(product: PublicProduct) {
  const rows = await prisma.product.findMany({
    where: { hidden: false, category: product.category, NOT: { id: product.id } },
    orderBy: { name: "asc" },
    take: 3,
  });
  return rows.map(toPublic);
}

export async function activeBanner() {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());
  return prisma.banner.findFirst({
    where: { startDate: { lte: today }, endDate: { gte: today } },
    orderBy: { createdAt: "desc" },
  });
}

export async function approvedReviews() {
  return prisma.review.findMany({
    where: { approved: true, hidden: false },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}
