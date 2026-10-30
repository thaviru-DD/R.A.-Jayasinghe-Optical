import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Photo } from "@/components/Photo";
import { PriceTag } from "@/components/Price";
import { Reviews } from "@/components/Reviews";
import { aboutParagraphs, shop, shopPhotos, whatsappLink } from "@/lib/site";
import { approvedReviews, toPublic } from "@/lib/products";
import { prisma } from "@/lib/db";

const services = [
  { title: "Eye testing", text: "30-minute appointments, one patient in each slot.", href: "/book" },
  { title: "Lenses", text: "Lenses from Globle, Novar, and Essilor, fitted in store.", href: "/lenses" },
  { title: "Spectacles", text: "Frames for men, women, and children.", href: "/spectacles" },
  { title: "Sunglasses", text: "Shades for the road, the coast, and every bright day.", href: "/sunglasses" },
];

const ticker = ["Eye tests", "Spectacles", "Sunglasses", "Contact lenses", "Lenses", "Ratmalana"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ review?: string }>;
}) {
  const sp = await searchParams;
  const [featuredRows, reviews] = await Promise.all([
    prisma.product.findMany({ where: { category: "lenses", featured: true, hidden: false }, orderBy: { name: "asc" }, take: 3 }),
    approvedReviews(),
  ]);
  const featured = featuredRows.map(toPublic);

  return (
    <>
      <Hero />
      <div className="marquee border-y border-navy/10 bg-ice">
        <div className="marquee-track py-4">
          {[0, 1].map((copy) => (
            <p key={copy} aria-hidden={copy === 1} className="flex items-center gap-8 px-4 text-sm font-semibold uppercase tracking-[0.2em]">
              {ticker.map((item) => (
                <span key={`${copy}-${item}`}>{item} <span className="text-aqua">●</span></span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.22em]">Our services</p>
        <h2 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">Care for your eyes, and the frames around them</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link key={service.title} href={service.href} className="rise rounded-[1.7rem] border border-navy/10 bg-white p-6 shadow-[0_16px_40px_rgba(3,4,94,0.05)] transition duration-500 hover:-translate-y-1 hover:bg-ice" style={{ animationDelay: `${index * 80}ms` }}>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-aqua font-heading text-lg font-semibold">0{index + 1}</span>
              <h3 className="mt-5 font-heading text-2xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-base leading-7">{service.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ice">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em]">Featured lenses</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold">Three brands we fit in store</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featured.map((lens) => (
              <Link key={lens.id} href={`/products/${lens.slug}`} className="group overflow-hidden rounded-[1.8rem] bg-white shadow-[0_18px_50px_rgba(3,4,94,0.06)] transition duration-500 hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] overflow-hidden bg-ice">
                  {lens.images[0] ? <Photo src={lens.images[0]} alt="" className="transition duration-700 group-hover:scale-105" /> : null}
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy/60">{lens.brand}</p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold">{lens.name}</h3>
                  <p className="mt-2 line-clamp-3">{lens.description}</p>
                  <p className="mt-4"><PriceTag product={lens} /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-ice">
            <Photo src={shopPhotos[0].src} alt={shopPhotos[0].alt} sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <p className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 font-semibold shadow">Since {shop.established}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em]">About us</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold">A Ratmalana shop, with time to get it right</h2>
          <div className="mt-6 space-y-4 text-lg leading-8">
            {aboutParagraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          </div>
          <a href={whatsappLink(`Hello ${shop.name}, I would like some help choosing eyewear.`)} className="mt-8 inline-flex rounded-full bg-aqua px-6 py-3 font-semibold text-navy">
            Message us on WhatsApp
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="orb left-[8%] top-8 h-40 w-40 bg-aqua/50" />
        <div className="orb bottom-0 right-[12%] h-52 w-52 bg-ice/30" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-aqua">Book an eye test</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">Thirty quiet minutes, just for your eyes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ice">
            No login. Choose an open slot up to 30 days ahead. Each slot takes one patient, and the shop confirms your visit by WhatsApp or email.
          </p>
          <Link href="/book" className="mt-8 inline-flex rounded-full bg-aqua px-6 py-3 font-semibold text-navy">
            Choose a time
          </Link>
        </div>
      </section>

      <Reviews reviews={reviews.map((review) => ({ id: review.id, name: review.name, rating: review.rating, comment: review.comment }))} received={sp.review === "received"} />
    </>
  );
}
