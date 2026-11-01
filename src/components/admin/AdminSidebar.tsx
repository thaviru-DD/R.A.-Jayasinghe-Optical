"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EyeMark } from "@/components/EyeMark";
import { logoutAction } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/homepage", label: "Homepage picks" },
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

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="relative mt-2 flex flex-1 flex-col gap-1 px-3 pb-4" aria-label="Admin">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Manage</p>
      {links.map((link) => {
        const active = isActive(pathname, link.href, "exact" in link ? link.exact : false);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
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
  );
}

function SidebarChrome({
  adminName,
  pathname,
  onNavigate,
}: {
  adminName: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const initials =
    adminName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A";

  return (
    <>
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-[#c4a35a]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#c4a35a]/40 to-transparent" />

      <div className="relative border-b border-white/10 px-5 py-6">
        <EyeMark className="h-10 w-20 text-aqua" />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c4a35a]">Shop admin</p>
        <p className="mt-2 font-heading text-xl font-semibold tracking-tight">Control panel</p>
        <div className="mt-4 flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-3 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua/20 font-heading text-sm font-semibold text-aqua">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminName}</p>
            <p className="text-xs text-white/50">Signed in</p>
          </div>
        </div>
      </div>

      <NavLinks pathname={pathname} onNavigate={onNavigate} />

      <div className="relative mt-auto space-y-3 border-t border-white/10 px-5 py-5">
        <Link
          href="/"
          onClick={onNavigate}
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
    </>
  );
}

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const current =
    links.find((link) => isActive(pathname, link.href, "exact" in link ? link.exact : false))?.label ?? "Admin";

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-navy/10 bg-[#02033a] px-4 py-3 text-white lg:hidden">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Shop admin</p>
          <p className="truncate font-heading text-lg font-semibold tracking-tight">{current}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold"
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" id="admin-mobile-menu">
          <button
            type="button"
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[min(20rem,88vw)] flex-col overflow-y-auto bg-[#02033a] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <SidebarChrome adminName={adminName} pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="relative hidden h-screen flex-col overflow-y-auto bg-[#02033a] text-white lg:sticky lg:top-0 lg:flex">
        <SidebarChrome adminName={adminName} pathname={pathname} />
      </aside>
    </>
  );
}
