import Link from "next/link";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { prisma } from "@/lib/db";

export default async function Page() {
  const [products, pendingBookings, pendingReviews] = await Promise.all([
    prisma.product.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.review.count({ where: { approved: false, hidden: false } }),
  ]);
  const cards = [
    ["Products", products, "/admin/products"],
    ["Pending bookings", pendingBookings, "/admin/bookings"],
    ["Reviews to approve", pendingReviews, "/admin/reviews"],
  ];
  return (
    <div>
      <h1 className="font-heading text-4xl font-semibold">Overview</h1>
      <p className="mt-2 max-w-2xl text-lg">Add the shop’s own photos and prices when you are ready. Sample frames are here so the pages are not empty.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="rounded-[1.5rem] bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">{label}</p>
            <p className="mt-2 font-heading text-4xl font-semibold">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 max-w-lg">
        <PasswordForm />
      </div>
    </div>
  );
}
