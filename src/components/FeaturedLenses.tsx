"use client";

import { useEffect, useId, useState } from "react";
import { LensTurnCard } from "@/components/LensTurnCard";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/motion";
import { Photo } from "@/components/Photo";

const brands = [
  {
    name: "Essilor",
    description: "Essilor lenses, finished and fitted in our shop to your prescription.",
    image: "/images/lenses/essilor.png",
    origin: "Made in France",
    details:
      "Essilor is a globally recognized French optical lens brand, known for its innovation, quality, and advanced lens technologies. With a strong commitment to improving vision, Essilor offers a wide range of lenses designed to meet different visual needs and lifestyles. From everyday prescription lenses to advanced progressive lenses and protective coatings, Essilor combines optical expertise with modern technology to deliver clear, comfortable vision.",
  },
  {
    name: "Global",
    description: "Global lenses, finished and fitted in our shop to your prescription.",
    image: "/images/lenses/globle.png",
    origin: "Fitted in Ratmalana",
    details:
      "Global lenses offer optical solutions designed to meet everyday vision needs. With a range of lens options for different prescriptions and preferences, Global provides customers with choices to suit their individual visual requirements. At R.A. Jayasinghe Opticians, we aim to help you find the right lenses for clear and comfortable everyday vision.",
  },
  {
    name: "NOVAR",
    description: "NOVAR lenses, finished and fitted in our shop to your prescription.",
    image: "/images/lenses/novar.jpg",
    origin: "Freeform lens design",
    details:
      "NOVAR is an innovative optical lens brand specializing in advanced lens designs and modern optical technologies. Offering a range of vision solutions, including single-vision, bifocal and progressive lenses, NOVAR focuses on personalized lens designs, visual clarity and everyday comfort. Its advanced freeform technologies help deliver tailored optical solutions for different visual needs.",
  },
] as const;

export function FeaturedLenses() {
  const [selected, setSelected] = useState<string | null>(null);
  const panelId = useId();
  const active = brands.find((brand) => brand.name === selected) ?? null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const panel = document.getElementById(panelId);
    panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, panelId]);

  return (
    <section className="relative overflow-hidden bg-ice">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-aqua/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="max-w-3xl">
          <RevealText>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-navy/55">Featured lenses</p>
          </RevealText>
          <RevealText delay={0.08}>
            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Three brands we fit in store
            </h2>
          </RevealText>
          <Reveal delay={0.14}>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
          </Reveal>
          <RevealText delay={0.18}>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-navy/70">
              The three main lenses we are offering: Essilor, Global and NOVAR. Select a brand to read more.
            </p>
          </RevealText>
        </div>

        <Stagger className="mt-14 grid gap-8 lg:grid-cols-3">
          {brands.map((lens, index) => (
            <StaggerItem key={lens.name}>
              <LensTurnCard
                name={lens.name}
                description={lens.description}
                image={lens.image}
                index={index}
                selected={selected === lens.name}
                onSelect={() => setSelected((current) => (current === lens.name ? null : lens.name))}
              />
            </StaggerItem>
          ))}
        </Stagger>

        {active ? (
          <div
            id={panelId}
            role="region"
            aria-label={`${active.name} lens details`}
            className="mt-10 overflow-hidden rounded-[2rem] border border-navy/8 bg-white shadow-[0_24px_60px_rgba(3,4,94,0.08)]"
          >
            <div className="border-b border-navy/8 bg-gradient-to-r from-[#02033a] via-[#03045e] to-[#02033a] px-6 py-5 text-white md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c4a35a]">{active.origin}</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <h3 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">{active.name}</h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-[#c4a35a] hover:text-[#c4a35a]"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr] md:p-8">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-ice">
                <Photo src={active.image} alt={active.name} />
              </div>
              <div>
                <p className="text-lg leading-8 text-navy/80">{active.details}</p>
                <p className="mt-6 text-sm text-navy/55">
                  Lenses are fitted in store to your prescription. Visit us in Ratmalana or message us on WhatsApp for advice.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
