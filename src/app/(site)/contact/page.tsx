import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { mission, shop, shopPhotos, vision, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit ${shop.name} at ${shop.address}. Opening hours, map, vision, and mission.`,
};

export default function Page() {
  const map = `https://maps.google.com/maps?q=${encodeURIComponent(shop.mapQuery)}&z=16&output=embed`;
  return (
    <>
      <PageHero
        variant="luxury"
        eyebrow="Contact"
        title="Visit the shop on Galle Road"
        text="One shop. No other branches. Come in, call, or message us on WhatsApp."
      />

      <section className="relative overflow-hidden bg-[#f7fbfd]">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div className="overflow-hidden rounded-[2rem] border border-navy/8 bg-white shadow-[0_18px_50px_rgba(3,4,94,0.05)]">
            <iframe
              title="Map showing R.A. Jayasinghe Opticians at No. 327, Galle Road, Ratmalana"
              src={map}
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-6 md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Address</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">{shop.address}</h2>
              <a
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-navy transition hover:text-[#c4a35a]"
                href={shop.mapsLink}
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-navy/8 bg-white p-6 shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Talk to us</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">We are ready to help</h2>
            <ul className="mt-5 space-y-3 text-lg">
              {shop.phones.map((phone) => (
                <li key={phone.tel}>
                  <a className="font-semibold transition hover:text-[#c4a35a]" href={`tel:${phone.tel}`}>
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a className="font-medium text-navy/75 transition hover:text-[#c4a35a]" href={`mailto:${shop.email}`}>
                  {shop.email}
                </a>
              </li>
              <li>
                <a
                  className="font-semibold transition hover:text-[#c4a35a]"
                  href={whatsappLink(`Hello ${shop.name}, I would like some help.`)}
                >
                  WhatsApp {shop.whatsappDisplay}
                </a>
              </li>
            </ul>

            <div className="mt-8 border-t border-navy/8 pt-6">
              <h3 className="font-heading text-xl font-semibold tracking-tight">Opening hours</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-navy/70">
                {shop.hours.map((item) => (
                  <li key={item.days} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                    <span>{item.days}</span>
                    <span className="font-medium text-navy">{item.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-[#c4a35a]">{shop.closedNote}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink(`Hello ${shop.name}, I would like some help.`)}
                className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-aqua hover:text-navy"
              >
                Message on WhatsApp
              </a>
              <a
                href={shop.reviewsLink}
                className="inline-flex rounded-full border border-navy/15 px-5 py-3 text-sm font-semibold transition hover:border-[#c4a35a]/40"
              >
                Google reviews
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#02033a] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/50 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2 md:py-20">
          <article className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Vision</p>
            <p className="mt-4 text-lg leading-8 text-white/75">{vision}</p>
          </article>
          <article className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Mission</p>
            <p className="mt-4 text-lg leading-8 text-white/75">{mission}</p>
          </article>
        </div>
      </section>

      <section className="bg-[#f7fbfd]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">The shop</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">A quiet corner of Ratmalana</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {shopPhotos.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-navy/8 bg-white shadow-[0_16px_40px_rgba(3,4,94,0.05)]"
              >
                <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 768px) 30vw, 100vw" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
