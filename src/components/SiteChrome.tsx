"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

function Drop({ label, href }: { label: string; href: string }) {
  const path = usePathname();
  const open = path === href || path.startsWith(`${href}/`);
  return (
    <details className="group relative" open={open ? undefined : undefined}>
      <summary className={`cursor-pointer list-none rounded-full px-3 py-2 font-semibold marker:content-none [&::-webkit-details-marker]:hidden ${open ? "bg-ice" : "hover:bg-ice"}`}>
        {label}
      </summary>
      <div className="absolute left-0 top-full z-20 mt-2 min-w-44 rounded-2xl border border-navy/10 bg-white p-2 shadow-xl">
        <Link className="block rounded-xl px-3 py-2 hover:bg-ice" href={href}>All {label.toLowerCase()}</Link>
        {audiences.map((item) => (
          <Link key={item.slug} className="block rounded-xl px-3 py-2 hover:bg-ice" href={`${href}/${item.slug}`}>
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function SiteChrome({ banner }: { banner: Banner }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

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

  return (
    <div className="sticky top-0 z-40">
      {path === "/" && banner ? (
        <div className="bg-navy text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center">
            {banner.image ? <img src={banner.image} alt="" className="h-8 w-8 rounded-full object-cover" /> : null}
            {banner.link ? (
              <Link href={banner.link} className="text-base font-medium hover:text-aqua">{banner.text}</Link>
            ) : (
              <p className="text-base font-medium">{banner.text}</p>
            )}
          </div>
        </div>
      ) : null}
      <header className="border-b border-navy/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          <Link href="/" className="shrink-0">
            <Image src="/brand/logo.png" alt="R.A. Jayasinghe Opticians" width={240} height={180} priority className="h-20 w-auto" />
          </Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            <Link href="/" className={`rounded-full px-3 py-2 font-semibold ${path === "/" ? "bg-ice" : "hover:bg-ice"}`}>Home</Link>
            <Drop label="Spectacles" href="/spectacles" />
            <Drop label="Sunglasses" href="/sunglasses" />
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`rounded-full px-3 py-2 font-semibold ${path.startsWith(link.href) ? "bg-ice" : "hover:bg-ice"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <form action="/search" className="ml-2 hidden md:block">
            <label className="sr-only" htmlFor="nav-search">Search products</label>
            <input id="nav-search" name="q" placeholder="Search" className="w-36 rounded-full border border-navy/15 bg-white px-4 py-2 xl:w-44" />
          </form>
          <Link href="/favourites" className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-ice" aria-label={`Favourites${count ? `, ${count} saved` : ""}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
            </svg>
            {count ? <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-aqua px-1 text-xs font-bold text-navy">{count}</span> : null}
          </Link>
          <Link href="/book" className="hidden rounded-full bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-aqua hover:text-navy sm:inline-flex">
            Book an eye test
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-ice lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open ? (
          <nav className="border-t border-navy/10 px-4 py-4 lg:hidden" aria-label="Mobile">
            <form action="/search" className="mb-3">
              <label className="sr-only" htmlFor="mobile-search">Search products</label>
              <input id="mobile-search" name="q" placeholder="Search frames or brands" className="w-full rounded-2xl border border-navy/15 px-4 py-3" />
            </form>
            <Link className="block rounded-xl px-3 py-3 font-semibold hover:bg-ice" href="/">Home</Link>
            <p className="px-3 pt-3 text-sm font-semibold uppercase tracking-[0.16em] text-navy/60">Spectacles</p>
            <Link className="block rounded-xl px-3 py-2 hover:bg-ice" href="/spectacles">All spectacles</Link>
            {audiences.map((item) => (
              <Link key={item.slug} className="block rounded-xl px-3 py-2 hover:bg-ice" href={`/spectacles/${item.slug}`}>{item.label}</Link>
            ))}
            <p className="px-3 pt-3 text-sm font-semibold uppercase tracking-[0.16em] text-navy/60">Sunglasses</p>
            <Link className="block rounded-xl px-3 py-2 hover:bg-ice" href="/sunglasses">All sunglasses</Link>
            {audiences.map((item) => (
              <Link key={`sun-${item.slug}`} className="block rounded-xl px-3 py-2 hover:bg-ice" href={`/sunglasses/${item.slug}`}>{item.label}</Link>
            ))}
            {links.map((link) => (
              <Link key={link.href} className="block rounded-xl px-3 py-3 font-semibold hover:bg-ice" href={link.href}>{link.label}</Link>
            ))}
            <Link href="/book" className="mt-3 inline-flex rounded-full bg-navy px-5 py-3 font-semibold text-white">Book an eye test</Link>
          </nav>
        ) : null}
      </header>
    </div>
  );
}
