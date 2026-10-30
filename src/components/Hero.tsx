"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { offer } from "@/components/PromoOffer";
import { shop } from "@/lib/site";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    if (media.matches) return;
    const video = videoRef.current;
    if (!video) return;
    const start = () => {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden bg-[#02033a] md:min-h-[calc(100svh-7.5rem)]">
      <div className="absolute inset-0">
        {reduce ? (
          <img src="/video/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster="/video/hero-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/video/hero-360.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02033a]/92 via-[#02033a]/55 to-[#02033a]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02033a]/70 via-transparent to-[#02033a]/25" />
      </div>

      <div className="relative z-10 border-b border-[#c4a35a]/25 bg-[#c4a35a]/15 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-center">
          <span className="rounded-full bg-[#c4a35a] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#02033a]">
            {offer.percent} off
          </span>
          <p className="text-sm font-medium tracking-wide text-white">
            Enjoy <span className="font-semibold text-[#c4a35a]">{offer.percent} off</span> selected eyewear — offer ends{" "}
            <span className="font-semibold text-white">{offer.endsLabel}</span>
          </p>
          <Link href={offer.href} className="text-sm font-semibold text-aqua transition hover:text-white">
            Shop now →
          </Link>
        </div>
      </div>

      {!reduce ? (
        <button
          type="button"
          className="absolute bottom-6 right-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:border-[#c4a35a] hover:bg-[#c4a35a] hover:text-navy"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) video.play().then(() => setPlaying(true)).catch(() => undefined);
            else {
              video.pause();
              setPlaying(false);
            }
          }}
        >
          <span className="grid h-5 w-5 place-items-center rounded-full border border-current">
            {playing ? (
              <span className="flex gap-0.5" aria-hidden>
                <span className="h-2.5 w-0.5 bg-current" />
                <span className="h-2.5 w-0.5 bg-current" />
              </span>
            ) : (
              <span className="ml-0.5 border-y-[4px] border-l-[7px] border-y-transparent border-l-current" aria-hidden />
            )}
          </span>
          {playing ? "Pause" : "Play"}
        </button>
      ) : null}

      <div className="relative mx-auto flex min-h-[calc(78svh-3rem)] max-w-7xl items-end px-4 pb-14 pt-16 md:min-h-[calc(100svh-10.5rem)] md:items-center md:pb-20 md:pt-12">
        <div className="max-w-2xl text-white">
          <p className="rise text-xs font-semibold uppercase tracking-[0.32em] text-[#c4a35a]">
            Ratmalana · Since {shop.established}
          </p>
          <p className="rise delay-1 mt-5 font-heading text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {shop.name}
          </p>
          <div className="rise delay-1 mt-4 h-px w-20 bg-gradient-to-r from-[#c4a35a] to-transparent" />
          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            <span className="rise delay-2 block">See clearly.</span>
            <span className="rise delay-3 mt-1 block text-aqua">Choose beautifully.</span>
          </h1>
          <p className="rise delay-3 mt-6 max-w-lg text-lg leading-8 text-white/75">{shop.tagline}</p>
          <div className="rise delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="btn-shine rounded-full bg-aqua px-7 py-3.5 font-semibold text-navy shadow-[0_16px_40px_rgba(144,224,239,0.25)] transition hover:bg-white"
            >
              Book an eye test
            </Link>
            <Link
              href="/spectacles"
              className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-[#c4a35a] hover:bg-[#c4a35a] hover:text-navy"
            >
              Browse spectacles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
