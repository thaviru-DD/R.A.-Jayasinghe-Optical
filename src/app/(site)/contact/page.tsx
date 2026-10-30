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
      <PageHero eyebrow="Contact" title="Visit the shop on Galle Road" text="One shop. No other branches. Come in, call, or message us on WhatsApp." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[1.8rem] bg-ice">
          <iframe title="Map showing R.A. Jayasinghe Opticians at No. 327, Galle Road, Ratmalana" src={map} className="h-80 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="p-6">
            <h2 className="font-heading text-2xl font-semibold">Address</h2>
            <p className="mt-2 text-lg">{shop.address}</p>
            <a className="mt-3 inline-flex font-semibold underline decoration-aqua decoration-2" href={shop.mapsLink}>Open in Google Maps</a>
          </div>
        </div>
        <div className="rounded-[1.8rem] border border-navy/10 p-6">
          <h2 className="font-heading text-2xl font-semibold">Talk to us</h2>
          <ul className="mt-4 space-y-2 text-lg">
            {shop.phones.map((phone) => <li key={phone.tel}><a className="font-semibold" href={`tel:${phone.tel}`}>{phone.display}</a></li>)}
            <li><a className="font-semibold" href={`mailto:${shop.email}`}>{shop.email}</a></li>
            <li><a className="font-semibold" href={whatsappLink(`Hello ${shop.name}, I would like some help.`)}>WhatsApp {shop.whatsappDisplay}</a></li>
          </ul>
          <h3 className="mt-6 font-heading text-xl font-semibold">Opening hours</h3>
          <ul className="mt-2 space-y-1">
            {shop.hours.map((item) => <li key={item.days}>{item.days}: {item.hours}</li>)}
          </ul>
          <p className="mt-2">{shop.closedNote}</p>
          <a className="mt-6 inline-flex font-semibold underline decoration-aqua decoration-2" href={shop.reviewsLink}>Read our Google reviews</a>
        </div>
      </div>
      <section className="bg-ice">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-2">
          <article className="rounded-[1.6rem] bg-white p-6">
            <h2 className="font-heading text-2xl font-semibold">Vision</h2>
            <p className="mt-3 text-lg leading-8">{vision}</p>
          </article>
          <article className="rounded-[1.6rem] bg-white p-6">
            <h2 className="font-heading text-2xl font-semibold">Mission</h2>
            <p className="mt-3 text-lg leading-8">{mission}</p>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-3xl font-semibold">The shop</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {shopPhotos.map((photo) => (
            <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-ice">
              <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 768px) 30vw, 100vw" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
