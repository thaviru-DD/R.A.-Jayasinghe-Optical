"use server";

import { randomBytes } from "crypto";
import { mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { clearSession, getAdmin, requireAdmin, setSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";
import { allow } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { BLOCKING_STATUSES, getOpenSlots } from "@/lib/slots";

async function saveUpload(file: File) {
  if (file.size > 6 * 1024 * 1024) throw new Error("Each image must be under 6 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.webp`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  try {
    await sharp(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, name));
  } catch {
    throw new Error("Please upload a JPEG, PNG, or WebP image.");
  }
  return `/uploads/${name}`;
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function loginAction(_prev: { error?: string } | null, formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const company = String(formData.get("company") || "");
  if (company) redirect("/admin");

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(`login:${ip}`, 8, 10 * 60 * 1000)) return { error: "Too many attempts. Please wait a few minutes." };

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return { error: "Those details were not recognised." };
  }
  await setSession(admin.id, admin.username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function changePassword(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const admin = await requireAdmin();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirm = String(formData.get("confirm") || "");
  if (next.length < 8) return { error: "Use at least 8 characters." };
  if (next !== confirm) return { error: "The new passwords do not match." };
  const row = await prisma.admin.findUnique({ where: { id: admin.id } });
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) return { error: "The current password is incorrect." };
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}

const productSchema = z.object({
  stockNumber: z.string().trim().max(40).optional(),
  name: z.string().trim().min(2).max(80),
  brand: z.string().trim().min(2).max(60),
  description: z.string().trim().min(8).max(2000),
  price: z.coerce.number().int().positive(),
  category: z.enum(["spectacles", "sunglasses", "contact-lenses", "lenses"]),
  audience: z.string().optional(),
  frameType: z.string().optional(),
  shape: z.string().optional(),
  discountType: z.string().optional(),
  discountValue: z.string().optional(),
  inStock: z.string().optional(),
  hidden: z.string().optional(),
  showDiscount: z.string().optional(),
  featured: z.string().optional(),
});

export async function saveProduct(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    stockNumber: formData.get("stockNumber") || "",
    name: formData.get("name"),
    brand: formData.get("brand"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    audience: formData.get("audience") || "",
    frameType: formData.get("frameType") || "",
    shape: formData.get("shape") || "",
    discountType: formData.get("discountType") || "",
    discountValue: formData.get("discountValue") || "",
    inStock: formData.get("inStock") || "",
    hidden: formData.get("hidden") || "",
    showDiscount: formData.get("showDiscount") || "",
    featured: formData.get("featured") || "",
  });
  if (!parsed.success) return { error: "Please complete the product fields." };
  const data = parsed.data;
  const framed = data.category === "spectacles" || data.category === "sunglasses";
  if (framed && !["men", "women", "unisex", "children"].includes(data.audience || "")) {
    return { error: "Choose men, women, unisex, or children." };
  }

  const stockNumber = data.stockNumber?.trim() ? data.stockNumber.trim().toUpperCase() : null;
  if (stockNumber && !/^[A-Z0-9][A-Z0-9\-_/]*$/i.test(stockNumber)) {
    return { error: "Stock number can only use letters, numbers, and - _ /." };
  }

  const discountType = data.discountType === "percent" || data.discountType === "price" ? data.discountType : null;
  const discountValue = data.discountValue ? Number(data.discountValue) : null;
  if (discountType && (discountValue == null || Number.isNaN(discountValue) || discountValue <= 0)) {
    return { error: "Enter a discount value, or set the discount to none." };
  }
  if (discountType === "percent" && discountValue! >= 100) return { error: "A percentage discount must be under 100." };
  if (discountType === "price" && discountValue! >= data.price) return { error: "The discount price must be lower than the price." };

  const slots = formData.getAll("imageSlot").map(String).slice(0, 4);
  const files = formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
  const images: string[] = [];
  let fileIndex = 0;
  try {
    for (const slot of slots) {
      if (slot.startsWith("/")) {
        images.push(slot);
        continue;
      }
      if (slot !== "new") continue;
      const file = files[fileIndex++];
      if (!file) return { error: "One of the new images could not be read. Please try again." };
      images.push(await saveUpload(file));
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The image could not be saved." };
  }
  const needsGallery = data.category !== "lenses";
  if (needsGallery && (images.length < 3 || images.length > 4)) {
    return { error: "Spectacles, sunglasses, and contact lenses need 3 or 4 images." };
  }
  if (!needsGallery && (images.length < 1 || images.length > 4)) return { error: "Add between 1 and 4 images." };

  const id = String(formData.get("id") || "");
  if (stockNumber) {
    const taken = await prisma.product.findFirst({
      where: { stockNumber, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (taken) return { error: "That stock number is already used on another product." };
  }

  const wantFeatured = framed && data.featured === "on";
  if (wantFeatured) {
    const featuredCount = await prisma.product.count({
      where: {
        featured: true,
        category: { in: ["spectacles", "sunglasses"] },
        ...(id ? { NOT: { id } } : {}),
      },
    });
    if (featuredCount >= 4) {
      return { error: "Homepage already has 4 featured products. Remove one first, or manage them under Homepage picks." };
    }
  }

  const payload = {
    stockNumber,
    name: data.name,
    brand: data.brand,
    description: data.description,
    price: data.price,
    category: data.category,
    audience: framed ? data.audience || null : null,
    frameType: framed ? data.frameType || null : null,
    shape: framed ? data.shape || null : null,
    discountType,
    discountValue: discountType ? Math.round(discountValue!) : null,
    showDiscount: data.showDiscount === "on" && Boolean(discountType),
    inStock: data.inStock === "on",
    hidden: data.hidden === "on",
    featured: wantFeatured,
    featuredOrder: null as number | null,
    images: JSON.stringify(images),
  };

  if (wantFeatured) {
    const maxOrder = await prisma.product.aggregate({
      where: { featured: true, category: { in: ["spectacles", "sunglasses"] }, ...(id ? { NOT: { id } } : {}) },
      _max: { featuredOrder: true },
    });
    payload.featuredOrder = (maxOrder._max.featuredOrder ?? 0) + 1;
  }

  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
  } else {
    const base = slugify(data.name) || "product";
    let slug = base;
    let n = 2;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${base}-${n}`;
      n += 1;
    }
    await prisma.product.create({ data: { ...payload, slug } });
  }
  refresh();
  redirect("/admin/products");
}

export async function saveHomeFeatured(formData: FormData) {
  await requireAdmin();
  const ids = [1, 2, 3, 4]
    .map((slot) => String(formData.get(`slot${slot}`) || "").trim())
    .filter(Boolean);

  if (ids.length !== new Set(ids).size) {
    redirect("/admin/homepage?error=duplicate");
  }

  const products = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids }, category: { in: ["spectacles", "sunglasses"] }, hidden: false },
        select: { id: true },
      })
    : [];
  if (products.length !== ids.length) {
    redirect("/admin/homepage?error=invalid");
  }

  await prisma.product.updateMany({
    where: { category: { in: ["spectacles", "sunglasses"] } },
    data: { featured: false, featuredOrder: null },
  });

  for (const [index, id] of ids.entries()) {
    await prisma.product.update({
      where: { id },
      data: { featured: true, featuredOrder: index + 1 },
    });
  }

  refresh();
  redirect("/admin/homepage?saved=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.product.delete({ where: { id } });
  refresh();
  redirect("/admin/products");
}

export async function updateProductStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const inStock = String(formData.get("inStock") || "") === "1";
  if (!id) return;
  await prisma.product.update({ where: { id }, data: { inStock } });
  refresh();
}

export async function updateProductPrice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const price = Number(formData.get("price"));
  if (!id || !Number.isInteger(price) || price < 1) return;
  await prisma.product.update({ where: { id }, data: { price } });
  refresh();
}

export async function applyBulkOffer(formData: FormData) {
  await requireAdmin();
  const action = String(formData.get("action") || "apply");
  const category = String(formData.get("category") || "all");
  const where =
    category === "spectacles" || category === "sunglasses" || category === "contact-lenses" || category === "lenses"
      ? { category }
      : undefined;

  if (action === "clear") {
    await prisma.product.updateMany({
      where,
      data: { discountType: null, discountValue: null, showDiscount: false },
    });
    refresh();
    redirect("/admin/products?offer=cleared");
  }

  const percent = Number(formData.get("percent"));
  if (!Number.isInteger(percent) || percent < 1 || percent >= 100) {
    redirect("/admin/products?offer=invalid");
  }

  await prisma.product.updateMany({
    where,
    data: {
      discountType: "percent",
      discountValue: percent,
      showDiscount: true,
    },
  });
  refresh();
  redirect(`/admin/products?offer=applied&percent=${percent}`);
}

export async function setBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["approved", "rejected", "pending"].includes(status)) return;
  await prisma.booking.update({ where: { id }, data: { status } });
  refresh();
}

export async function rescheduleBooking(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const slots = await getOpenSlots(date, id);
  if (!slots.ok || !slots.slots.some((slot) => slot.time === time && slot.available)) {
    redirect("/admin/bookings?error=slot");
  }
  const clash = await prisma.booking.findFirst({
    where: { date, time, status: { in: [...BLOCKING_STATUSES] }, NOT: { id } },
  });
  if (clash) redirect("/admin/bookings?error=slot");
  await prisma.booking.update({ where: { id }, data: { date, time, status: "rescheduled" } });
  refresh();
  redirect("/admin/bookings?updated=1");
}

export async function moderateReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  if (!id) return;
  if (action === "delete") await prisma.review.delete({ where: { id } });
  if (action === "approve") await prisma.review.update({ where: { id }, data: { approved: true, hidden: false } });
  if (action === "hide") await prisma.review.update({ where: { id }, data: { hidden: true } });
  if (action === "show") await prisma.review.update({ where: { id }, data: { hidden: false } });
  refresh();
}

const bannerSchema = z.object({
  text: z.string().trim().min(4).max(180),
  link: z.string().trim().max(200).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function saveBanner(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const parsed = bannerSchema.safeParse({
    text: formData.get("text"),
    link: String(formData.get("link") || ""),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });
  if (!parsed.success) return { error: "Check the banner text and dates." };
  if (parsed.data.endDate < parsed.data.startDate) return { error: "The end date must be on or after the start date." };
  const file = formData.get("image");
  let image = String(formData.get("currentImage") || "") || null;
  if (formData.get("removeImage") === "on") image = null;
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUpload(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The image could not be saved." };
    }
  }
  const id = String(formData.get("id") || "");
  const data = { text: parsed.data.text, link: parsed.data.link || null, startDate: parsed.data.startDate, endDate: parsed.data.endDate, image };
  if (id) await prisma.banner.update({ where: { id }, data });
  else await prisma.banner.create({ data });
  refresh();
  redirect("/admin/banners");
}

export async function deleteBanner(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.banner.delete({ where: { id } });
  refresh();
}

const offerBannerSchema = z.object({
  percent: z.coerce.number().int().min(1).max(99),
  title: z.string().trim().min(2).max(80),
  endsLabel: z.string().trim().min(2).max(60),
  href: z.string().trim().min(1).max(120),
  enabled: z.string().optional(),
  syncProducts: z.string().optional(),
});

export async function saveOfferBanner(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  await requireAdmin();
  const parsed = offerBannerSchema.safeParse({
    percent: formData.get("percent"),
    title: formData.get("title"),
    endsLabel: formData.get("endsLabel"),
    href: formData.get("href") || "/spectacles",
    enabled: formData.get("enabled") || "",
    syncProducts: formData.get("syncProducts") || "",
  });
  if (!parsed.success) return { error: "Check the offer percent, title, end date text, and link." };

  const enabled = parsed.data.enabled === "on";
  await prisma.offerBanner.upsert({
    where: { id: "site-offer" },
    update: {
      enabled,
      percent: parsed.data.percent,
      title: parsed.data.title,
      endsLabel: parsed.data.endsLabel,
      href: parsed.data.href.startsWith("/") ? parsed.data.href : `/${parsed.data.href}`,
    },
    create: {
      id: "site-offer",
      enabled,
      percent: parsed.data.percent,
      title: parsed.data.title,
      endsLabel: parsed.data.endsLabel,
      href: parsed.data.href.startsWith("/") ? parsed.data.href : `/${parsed.data.href}`,
    },
  });

  if (parsed.data.syncProducts === "on" && enabled) {
    await prisma.product.updateMany({
      data: {
        discountType: "percent",
        discountValue: parsed.data.percent,
        showDiscount: true,
      },
    });
  }

  refresh();
  return { ok: true };
}

const articleSchema = z.object({
  title: z.string().trim().min(4).max(140),
  excerpt: z.string().trim().min(8).max(240),
  category: z.string().trim().min(2).max(40),
  content: z.string().trim().min(20).max(20000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  published: z.string().optional(),
});

export async function saveArticle(_prev: { error?: string } | null, formData: FormData) {
  await requireAdmin();
  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    category: formData.get("category"),
    content: formData.get("content"),
    date: formData.get("date"),
    published: formData.get("published") || "",
  });
  if (!parsed.success) return { error: "Please complete the article." };
  const file = formData.get("cover");
  let cover = String(formData.get("currentCover") || "") || null;
  if (file instanceof File && file.size > 0) {
    try {
      cover = await saveUpload(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "The cover image could not be saved." };
    }
  }
  const id = String(formData.get("id") || "");
  const payload = { ...parsed.data, published: parsed.data.published === "on", cover };
  if (id) {
    await prisma.article.update({ where: { id }, data: payload });
  } else {
    const base = slugify(parsed.data.title) || "article";
    let slug = base;
    let n = 2;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${base}-${n}`;
      n += 1;
    }
    await prisma.article.create({ data: { ...payload, slug } });
  }
  refresh();
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.article.delete({ where: { id } });
  refresh();
  redirect("/admin/articles");
}

export async function saveHoliday(formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("date") || "");
  const reason = String(formData.get("reason") || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || reason.length < 2) return;
  await prisma.holiday.upsert({ where: { date }, update: { reason }, create: { date, reason } });
  refresh();
}

export async function deleteHoliday(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.holiday.delete({ where: { id } });
  refresh();
}

export async function whoami() {
  return getAdmin();
}
