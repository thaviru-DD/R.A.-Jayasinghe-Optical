import type { ReactNode } from "react";
import Link from "next/link";
import { EyeMark } from "@/components/EyeMark";
import { shop, social, whatsappLink } from "@/lib/site";

const explore = [
  ["Home", "/"],
  ["Spectacles", "/spectacles"],
  ["Sunglasses", "/sunglasses"],
  ["Contact lenses", "/contact-lenses"],
  ["Lenses", "/lenses"],
  ["Book an eye test", "/book"],
  ["Articles", "/articles"],
  ["Favourites", "/favourites"],
  ["Contact", "/contact"],
];

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm.2 2A3.6 3.6 0 0 0 4.4 7.6v8.8A3.6 3.6 0 0 0 8 20h8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16 4.4H8Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.5 21.64a6.34 6.34 0 0 0 6.33-6.33V8.83a8.18 8.18 0 0 0 4.78 1.52V6.9a4.85 4.85 0 0 1-1.02-.21Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.52 14.94L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.95 12.25l-.35.55.1.63.66 3.84-3.96-1.04-.6.36A8.1 8.1 0 0 1 12.04 3.8Zm-3.1 3.7c-.2 0-.52.08-.8.4-.27.31-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.07 3.3 5.12 4.5 2.54 1 3.06.8 3.61.76.55-.05 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51Z" />
    </svg>
  );
}

const socialLinks: { name: string; href: string; icon: ReactNode }[] = [
  { name: "Facebook", href: social.facebook, icon: <IconFacebook /> },
  { name: "Instagram", href: social.instagram, icon: <IconInstagram /> },
  { name: "TikTok", href: social.tiktok, icon: <IconTikTok /> },
  { name: "WhatsApp", href: whatsappLink(), icon: <IconWhatsApp /> },
];

function SocialIcon({ name, href, icon }: { name: string; href: string; icon: ReactNode }) {
  const className =
    "grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/90 transition duration-300 hover:border-[#c4a35a] hover:bg-[#c4a35a] hover:text-navy";

  if (!href) {
    return (
      <span className={className} title={`${name} · coming soon`} aria-label={`${name} coming soon`}>
        {icon}
      </span>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer" aria-label={name}>
      {icon}
    </a>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c4a35a]">
      {children}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#02033a] text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-aqua/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#c4a35a]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10">
        <div className="grid gap-10 rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm md:p-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <EyeMark className="h-12 w-24 text-aqua" />
            <p className="mt-5 font-heading text-3xl font-semibold tracking-tight md:text-4xl">{shop.name}</p>
            <div className="mt-4 h-px w-20 bg-gradient-to-r from-[#c4a35a] to-transparent" />
            <p className="mt-5 max-w-md text-base leading-8 text-white/70">{shop.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <SocialIcon key={item.name} {...item} />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-[1.8rem] border border-white/10 bg-navy/40 p-6 md:p-7">
            <div>
              <SectionTitle>Book a visit</SectionTitle>
              <p className="mt-3 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                Thirty quiet minutes for clearer vision
              </p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Reserve an eye test online, or message us on WhatsApp for frames and fittings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="btn-shine inline-flex rounded-full bg-aqua px-5 py-3 text-sm font-semibold text-navy transition hover:bg-white"
              >
                Book an eye test
              </Link>
              <a
                href={whatsappLink(`Hello ${shop.name}, I would like some help choosing eyewear.`)}
                className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c4a35a] hover:text-[#c4a35a]"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <SectionTitle>Visit</SectionTitle>
            <p className="mt-4 text-lg font-medium leading-8">{shop.address}</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-white/65">
              {shop.hours.map((item) => (
                <li key={item.days} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                  <span>{item.days}</span>
                  <span className="text-white/85">{item.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[#c4a35a]/90">{shop.closedNote}</p>
          </div>

          <div>
            <SectionTitle>Contact</SectionTitle>
            <ul className="mt-4 space-y-3">
              {shop.phones.map((phone) => (
                <li key={phone.tel}>
                  <a className="text-lg font-medium transition hover:text-aqua" href={`tel:${phone.tel}`}>
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a className="text-white/70 transition hover:text-aqua" href={`mailto:${shop.email}`}>
                  {shop.email}
                </a>
              </li>
            </ul>
            <a
              href={shop.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#c4a35a] transition hover:text-aqua"
            >
              Open in Maps →
            </a>
          </div>

          <div>
            <SectionTitle>Explore</SectionTitle>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {explore.map(([label, href]) => (
                <li key={href}>
                  <Link className="text-white/70 transition hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} {shop.name}</p>
          <p className="tracking-[0.18em] uppercase">One shop · Ratmalana · Since {shop.established}</p>
        </div>
      </div>
    </footer>
  );
}
