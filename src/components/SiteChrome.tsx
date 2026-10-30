"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { readFavourites } from "@/lib/favourites";
import { audiences } from "@/lib/site";

type Banner = { text: string; link: string | null; image: string | null } | null;

const links = [
  { href: "/contact-lenses", label: "Contact lenses" },
  { href: "/lenses", label: "Lenses" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

function navClass(active: boolean) {
  return [
    "relative rounded-full px-3.5 py-2 text-sm font-semibold tracking-wide transition duration-300",
    active
      ? "bg-navy text-white shadow-[0_10px_24px_rgba(3,4,94,0.18)]"
      : "text-navy/80 hover:bg-[#f7fbfd] hover:text-navy",
  ].join(" ");
}

function Drop({ label, href }: { label: string; href: string }) {
  const path = usePathname();
  const active = path === href || path.startsWith(`${href}/`);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${navClass(active || open)} inline-flex items-center gap-1.5`}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 transition duration-300 ${open ? "rotate-180" : ""} ${active || open ? "text-aqua" : "text-[#c4a35a]"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-3 min-w-52 overflow-hidden rounded-[1.4rem] border border-navy/10 bg-white/95 p-2 shadow-[0_24px_60px_rgba(3,4,94,0.14)] backdrop-blur-xl"
        >
          <div className="mb-1 px-3 pb-2 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">{label}</p>
          </div>
          <Link
            role="menuitem"
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-navy/80 transition hover:bg-[#f7fbfd] hover:text-navy"
            href={href}
            onClick={() => setOpen(false)}
          >
            All {label.toLowerCase()}
          </Link>
          {audiences.map((item) => (
            <Link
              key={item.slug}
              role="menuitem"
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-navy/80 transition hover:bg-[#f7fbfd] hover:text-navy"
              href={`${href}/${item.slug}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteChrome({ banner }: { banner: Banner }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setCount(readFavourites().length);
    sync();
    window.addEventListener("favourites:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favourites:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40">
      {path === "/" && banner ? (
        <div className="relative overflow-hidden bg-[#02033a] text-white">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/60 to-transparent" />
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center">
            {banner.image ? (
              <img src={banner.image} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-[#c4a35a]/40" />
            ) : null}
            {banner.link ? (
              <Link href={banner.link} className="text-sm font-medium tracking-wide text-white/90 transition hover:text-aqua">
                {banner.text}
              </Link>
            ) : (
              <p className="text-sm font-medium tracking-wide text-white/90">{banner.text}</p>
            )}
          </div>
        </div>
      ) : null}

      <header
        className={`border-b transition duration-300 ${
          scrolled
            ? "border-navy/10 bg-white/85 shadow-[0_12px_40px_rgba(3,4,94,0.08)] backdrop-blur-xl"
            : "border-navy/8 bg-white/75 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <Link href="/" className="shrink-0 transition duration-300 hover:opacity-90">
            <Image
              src="/brand/logo.png"
              alt="R.A. Jayasinghe Opticians"
              width={240}
              height={180}
              priority
              className="h-[4.5rem] w-auto md:h-20"
            />
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Main">
            <Link href="/" className={navClass(path === "/")}>
              Home
            </Link>
            <Drop label="Spectacles" href="/spectacles" />
            <Drop label="Sunglasses" href="/sunglasses" />
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={navClass(path.startsWith(link.href))}>
                {link.label}
              </Link>
            ))}
          </nav>

          <form action="/search" className="ml-2 hidden md:block">
            <label className="sr-only" htmlFor="nav-search">
              Search products
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16.5 16.5 20 20" strokeLinecap="round" />
              </svg>
              <input
                id="nav-search"
                name="q"
                placeholder="Search"
                className="w-36 rounded-full border border-navy/12 bg-[#f7fbfd] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#c4a35a]/50 focus:bg-white xl:w-48"
              />
            </div>
          </form>

          <Link
            href="/favourites"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-navy/10 bg-white text-navy transition hover:border-[#c4a35a]/40 hover:bg-[#f7fbfd]"
            aria-label={`Favourites${count ? `, ${count} saved` : ""}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
            </svg>
            {count ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c4a35a] px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-navy/10 bg-white transition hover:bg-[#f7fbfd] lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open ? (
          <nav className="border-t border-navy/10 bg-white/95 px-4 py-5 backdrop-blur-xl lg:hidden" aria-label="Mobile">
            <form action="/search" className="mb-4">
              <label className="sr-only" htmlFor="mobile-search">
                Search products
              </label>
              <input
                id="mobile-search"
                name="q"
                placeholder="Search frames or brands"
                className="w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3 outline-none focus:border-[#c4a35a]/50 focus:bg-white"
              />
            </form>

            <Link className="block rounded-2xl px-3 py-3 font-semibold hover:bg-[#f7fbfd]" href="/">
              Home
            </Link>

            <p className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Spectacles</p>
            <Link className="block rounded-xl px-3 py-2.5 text-navy/80 hover:bg-[#f7fbfd]" href="/spectacles">
              All spectacles
            </Link>
            {audiences.map((item) => (
              <Link key={item.slug} className="block rounded-xl px-3 py-2.5 text-navy/80 hover:bg-[#f7fbfd]" href={`/spectacles/${item.slug}`}>
                {item.label}
              </Link>
            ))}

            <p className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Sunglasses</p>
            <Link className="block rounded-xl px-3 py-2.5 text-navy/80 hover:bg-[#f7fbfd]" href="/sunglasses">
              All sunglasses
            </Link>
            {audiences.map((item) => (
              <Link key={`sun-${item.slug}`} className="block rounded-xl px-3 py-2.5 text-navy/80 hover:bg-[#f7fbfd]" href={`/sunglasses/${item.slug}`}>
                {item.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-navy/8 pt-3">
              {links.map((link) => (
                <Link key={link.href} className="block rounded-2xl px-3 py-3 font-semibold hover:bg-[#f7fbfd]" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </header>
    </div>
  );
}
