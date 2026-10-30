import Link from "next/link";
import { logoutAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/bookings", "Bookings"],
  ["/admin/reviews", "Reviews"],
  ["/admin/banners", "Banners"],
  ["/admin/articles", "Articles"],
  ["/admin/holidays", "Holidays"],
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-ice lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col bg-navy p-5 text-white">
        <p className="font-heading text-xl font-semibold">Shop admin</p>
        <p className="mt-1 text-ice">{admin.name}</p>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Admin">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-xl px-3 py-2 hover:bg-white/10">{label}</Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="rounded-full bg-aqua px-4 py-2 font-semibold text-navy" type="submit">Log out</button>
        </form>
      </aside>
      <main id="content" className="px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
