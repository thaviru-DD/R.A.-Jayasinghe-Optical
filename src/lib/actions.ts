"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/rate-limit";
import { BLOCKING_STATUSES, getOpenSlots } from "@/lib/slots";
import { toPublic } from "@/lib/products";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient name.").max(80),
  phone: z
    .string()
    .trim()
    .min(9)
    .max(20)
    .refine((value) => value.replace(/\D/g, "").length >= 9, "Enter a valid telephone number."),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  age: z.coerce.number({ invalid_type_error: "Enter the patient's age." }).int().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time slot."),
  company: z.string().optional(),
  started: z.coerce.number().optional(),
});

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(4, "Write a short comment.").max(800),
  company: z.string().optional(),
  started: z.coerce.number().optional(),
});

async function clientKey(prefix: string) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${prefix}:${ip}`;
}

export async function createBooking(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    age: formData.get("age"),
    date: formData.get("date"),
    time: formData.get("time"),
    company: formData.get("company") || "",
    started: formData.get("started") || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the form." };
  const data = parsed.data;
  if (data.company) return { ok: true };
  if (data.started && Date.now() - data.started < 1200) return { ok: true };
  if (!(await allow(await clientKey("book"), 5, 10 * 60 * 1000))) {
    return { error: "Please wait a few minutes before sending another booking." };
  }

  const slots = await getOpenSlots(data.date);
  if (!slots.ok) return { error: slots.reason };
  const slot = slots.slots.find((item) => item.time === data.time);
  if (!slot?.available) return { error: "That time slot is no longer available. Please choose another." };

  try {
    await prisma.$transaction(async (tx) => {
      const clash = await tx.booking.findFirst({
        where: { date: data.date, time: data.time, status: { in: [...BLOCKING_STATUSES] } },
      });
      if (clash) throw new Error("taken");
      await tx.booking.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          age: data.age,
          date: data.date,
          time: data.time,
          status: "pending",
        },
      });
    });
  } catch {
    return { error: "That time slot has just been booked. Please choose another." };
  }

  redirect(`/book?date=${data.date}&sent=1`);
}

export async function createReview(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const parsed = reviewSchema.safeParse({
    name: formData.get("name"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
    company: formData.get("company") || "",
    started: formData.get("started") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the review." };
  const data = parsed.data;
  if (data.company) return { ok: true };
  if (data.started && Date.now() - data.started < 1200) return { ok: true };
  if (!(await allow(await clientKey("review"), 4, 10 * 60 * 1000))) {
    return { error: "Please wait a few minutes before posting another review." };
  }

  await prisma.review.create({
    data: { name: data.name, rating: data.rating, comment: data.comment, approved: false, hidden: false },
  });
  redirect("/?review=received#reviews");
}

export async function getProductsByIds(ids: string[]) {
  const unique = [...new Set(ids)].slice(0, 100);
  if (!unique.length) return [];
  const rows = await prisma.product.findMany({ where: { id: { in: unique }, hidden: false } });
  const order = new Map(unique.map((id, index) => [id, index]));
  return rows.map(toPublic).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export async function fetchSlots(date: string, ignoreId?: string) {
  if (ignoreId) {
    const admin = await getAdmin();
    if (!admin) return { ok: false as const, reason: "Please sign in again." };
  }
  return getOpenSlots(date, ignoreId);
}
