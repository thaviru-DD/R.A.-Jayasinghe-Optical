"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Photo } from "@/components/Photo";
import { Reviews } from "@/components/Reviews";
import { CountUpStat } from "@/components/CountUpStat";
import { FeaturedLenses } from "@/components/FeaturedLenses";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { PromoOffer } from "@/components/PromoOffer";
import type { PublicProduct, SiteOffer } from "@/lib/products";
import {
  ParallaxFrame,
  Reveal,
  RevealText,
  ScrollProgress,
  Stagger,
  StaggerItem,
  luxuryEase,
} from "@/components/motion";
import { aboutCollage, aboutParagraphs, shop, whatsappLink } from "@/lib/site";

const MotionLink = motion.create(Link);

const services = [
  { title: "Eye testing", text: "Computer-based eye testing for a clear, precise prescription.", href: "/book" },
  { title: "Lenses", text: "Lenses from Globle, Novar, and Essilor, fitted in store.", href: "/lenses" },
  { title: "Spectacles", text: "Frames for men, women, unisex, and children.", href: "/spectacles" },
  { title: "Sunglasses", text: "Shades for the road, the coast, and every bright day.", href: "/sunglasses" },
];

const ticker = ["Eye testing", "Spectacles", "Sunglasses", "Contact lenses", "Lenses", "Ratmalana"];

type Review = { id: string; name: string; rating: number; comment: string };

export function HomeBody({
  reviews,
  received,
  featuredProducts,
  offer,
}: {
  reviews: Review[];
  received: boolean;
  featuredProducts: PublicProduct[];
  offer: SiteOffer | null;
}) {
  return (
    <>
      <ScrollProgress />

      <Reveal y={12}>
        <div className="relative overflow-hidden border-y border-[#c4a35a]/25 bg-[#02033a]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/35 to-transparent" />
          <div className="marquee">
            <div className="marquee-track py-5">
              {[0, 1].map((copy) => (
                <p
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex items-center gap-10 px-6 text-xs font-semibold uppercase tracking-[0.32em] text-white/85 md:text-sm md:tracking-[0.36em]"
                >
                  {ticker.map((item) => (
                    <span key={`${copy}-${item}`} className="inline-flex items-center gap-10 whitespace-nowrap">
                      <span className="transition-colors hover:text-[#c4a35a]">{item}</span>
                      <span className="text-[#c4a35a]" aria-hidden>
                        ✦
                      </span>
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <div className="max-w-3xl">
            <RevealText>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-navy/55">Our services</p>
            </RevealText>
            <RevealText delay={0.08}>
              <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                Care for your eyes, and the frames around them
              </h2>
            </RevealText>
            <Reveal delay={0.14}>
              <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
            </Reveal>
            <RevealText delay={0.18}>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy/70">
                From computer-based testing to frames and lenses fitted in store — each visit is unhurried, precise, and personal.
              </p>
            </RevealText>
          </div>

          <Reveal delay={0.2} className="mt-10">
            <PromoOffer offer={offer} tone="gold" />
          </Reveal>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <StaggerItem key={service.title}>
                <MotionLink
                  href={service.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-navy/8 bg-[#f7fbfd] p-7 shadow-[0_18px_50px_rgba(3,4,94,0.04)]"
                  whileHover={{ y: -10, transition: { duration: 0.45, ease: luxuryEase } }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/50 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-navy/10 bg-white font-heading text-sm font-semibold text-navy shadow-sm transition duration-500 group-hover:border-aqua group-hover:bg-navy group-hover:text-aqua">
                      0{index + 1}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">
                      Service
                    </span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-7 text-navy/70">{service.text}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy transition group-hover:text-[#c4a35a]">
                    Explore
                    <span aria-hidden className="transition duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </MotionLink>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} />

      <FeaturedLenses />

      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal y={48} className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            {/* Magazine collage: large photo + overlay + 2007 tile (ELLE-style) */}
            <div className="relative mx-auto aspect-[5/6] w-full max-w-[34rem]">
              <div className="absolute bottom-[10%] left-0 right-[14%] top-0 overflow-hidden bg-[#f0f0f0]">
                <ParallaxFrame className="h-full w-full" intensity={18}>
                  <Photo
                    src={aboutCollage.main.src}
                    alt={aboutCollage.main.alt}
                    sizes="(min-width: 1024px) 36vw, 88vw"
                    className="object-cover object-center"
                  />
                </ParallaxFrame>
              </div>

              <motion.div
                className="absolute right-0 top-[4%] z-10 w-[46%] overflow-hidden shadow-[0_18px_40px_rgba(11,31,59,0.12)]"
                initial={{ opacity: 0, y: 20, x: 10 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: 0.16, duration: 0.85, ease: luxuryEase }}
              >
                <div className="relative aspect-[4/5]">
                  <Photo
                    src={aboutCollage.overlay.src}
                    alt={aboutCollage.overlay.alt}
                    sizes="(min-width: 1024px) 16vw, 42vw"
                    className="object-cover object-[center_15%]"
                  />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-0 z-20 flex aspect-square w-[40%] max-w-[11.5rem] items-center justify-center bg-[#e8e8e8] px-3 py-4 text-center"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.28, duration: 0.8, ease: luxuryEase }}
              >
                <div>
                  <p className="font-heading text-[clamp(1.85rem,4.8vw,2.75rem)] font-semibold leading-none tracking-tight text-navy">
                    {shop.established}
                  </p>
                  <p className="mt-2 font-heading text-[clamp(0.72rem,1.7vw,0.95rem)] font-medium leading-tight tracking-[0.04em] text-navy/75">
                    since
                    <br />
                    Ratmalana
                  </p>
                </div>
              </motion.div>
            </div>
          </Reveal>

          <div>
            <RevealText>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-navy/55">About us</p>
            </RevealText>
            <RevealText delay={0.08}>
              <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                A Ratmalana shop, with time to get it right
              </h2>
            </RevealText>
            <Reveal delay={0.14}>
              <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
            </Reveal>
            <div className="mt-7 space-y-5 text-lg leading-8 text-navy/80">
              {aboutParagraphs.map((paragraph, index) => (
                <RevealText key={paragraph.slice(0, 24)} delay={0.16 + index * 0.08}>
                  <p>{paragraph}</p>
                </RevealText>
              ))}
            </div>

            <Reveal delay={0.34}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappLink(`Hello ${shop.name}, I would like some help choosing eyewear.`)}
                  className="btn-shine inline-flex rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy"
                >
                  Message us on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex rounded-full border border-navy/15 bg-white px-6 py-3.5 font-semibold text-navy transition hover:border-aqua hover:bg-ice"
                >
                  Visit the shop
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.42}>
              <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                <CountUpStat value={19} suffix="+" label="Years in Ratmalana" duration={1200} />
                <CountUpStat value={3} label="Lens brands fitted" duration={1000} />
                <CountUpStat value={100000} suffix="+" label="Customers" duration={2200} />
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#02033a] text-white">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-aqua/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#c4a35a]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/55 to-transparent" />
        <div className="orb left-[10%] top-12 h-36 w-36 bg-aqua/30" />
        <div className="orb bottom-8 right-[14%] h-44 w-44 bg-ice/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-28">
          <Reveal
            className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-12 lg:p-14"
            y={40}
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c4a35a]">Book an eye test</p>
                <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  Thirty quiet minutes, just for your eyes
                </h2>
                <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                  No login. Choose an open slot up to 30 days ahead. Each appointment is one patient at a time, confirmed by WhatsApp or email.
                </p>
                <div className="mt-7">
                  <PromoOffer offer={offer} tone="dark" />
                </div>
                <div className="mt-9 flex flex-wrap gap-3">
                  <MotionLink
                    href="/book"
                    className="btn-shine inline-flex rounded-full bg-aqua px-7 py-3.5 font-semibold text-navy shadow-[0_16px_40px_rgba(144,224,239,0.22)]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.35, ease: luxuryEase }}
                  >
                    Choose a time
                  </MotionLink>
                  <a
                    href={whatsappLink(`Hello ${shop.name}, I would like to book an eye test.`)}
                    className="inline-flex rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:border-[#c4a35a] hover:text-[#c4a35a]"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["30 min", "Unhurried appointment"],
                  ["1 guest", "One patient per slot"],
                  ["30 days", "Book ahead with ease"],
                ].map(([value, label], index) => (
                  <motion.div
                    key={label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] px-5 py-5"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + index * 0.08, duration: 0.7, ease: luxuryEase }}
                  >
                    <p className="font-heading text-3xl font-semibold tracking-tight text-aqua">{value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal y={40}>
        <Reviews reviews={reviews} received={received} />
      </Reveal>
    </>
  );
}
