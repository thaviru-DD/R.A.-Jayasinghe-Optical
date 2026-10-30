"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EyeMark } from "@/components/EyeMark";
import { logoutAction } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/holidays", label: "Holidays" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="relative flex flex-col overflow-hidden bg-[#02033a] text-white lg:min-h-screen">
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-[#c4a35a]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#c4a35a]/40 to-transparent" />

      <div className="relative border-b border-white/10 px-5 py-6">
        <EyeMark className="h-10 w-20 text-aqua" />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c4a35a]">Shop admin</p>
        <p className="mt-2 font-heading text-xl font-semibold tracking-tight">Control panel</p>
        <div className="mt-4 flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-3 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua/20 font-heading text-sm font-semibold text-aqua">
            {adminName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join("") || "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminName}</p>
            <p className="text-xs text-white/50">Signed in</p>
          </div>
        </div>
      </div>

      <nav className="relative mt-4 flex flex-1 flex-col gap-1 px-3 pb-4" aria-label="Admin">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Manage</p>
        {links.map((link) => {
          const active = isActive(pathname, link.href, "exact" in link ? link.exact : false);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-xl px-3 py-2.5 text-sm font-medium transition duration-300 ${
                active
                  ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(196,163,90,0.35)]"
                  : "text-white/65 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[#c4a35a]" aria-hidden />
              ) : null}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative space-y-3 border-t border-white/10 px-5 py-5">
        <Link
          href="/"
          className="block text-sm font-medium text-white/60 transition hover:text-[#c4a35a]"
        >
          ← View website
        </Link>
        <form action={logoutAction}>
          <button
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#c4a35a] hover:bg-[#c4a35a] hover:text-[#02033a]"
            type="submit"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
