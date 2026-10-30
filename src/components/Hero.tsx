"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    <section className="relative isolate overflow-hidden bg-white md:min-h-[calc(100svh-8.5rem)]">
      <div className="relative h-[42svh] min-h-[220px] overflow-hidden md:absolute md:inset-0 md:h-full md:min-h-0">
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
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/70 to-transparent md:block" />
        {!reduce ? (
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-navy/90 px-4 py-2 text-sm font-semibold text-white"
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
            {playing ? "Pause video" : "Play video"}
          </button>
        ) : null}
      </div>
      <div className="relative mx-auto flex max-w-7xl px-4 py-8 md:min-h-[calc(100svh-8.5rem)] md:items-center md:py-16">
        <div className="max-w-xl md:rounded-[2rem] md:bg-white/92 md:p-10 md:shadow-[0_24px_70px_rgba(3,4,94,0.16)] md:backdrop-blur-md">
          <p className="rise text-sm font-semibold uppercase tracking-[0.22em]">Ratmalana · Since {shop.established}</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold leading-[1.05] md:text-7xl">
            <span className="rise delay-1 block">See clearly.</span>
            <span className="rise delay-2 mt-1 block">Choose beautifully.</span>
          </h1>
          <div className="rise delay-3 mt-5 h-1.5 w-28 origin-left rounded-full bg-aqua" />
          <p className="rise delay-3 mt-5 text-lg leading-8">{shop.tagline}</p>
          <div className="rise delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-shine rounded-full bg-navy px-6 py-3 font-semibold text-white transition hover:bg-aqua hover:text-navy">
              Book an eye test
            </Link>
            <Link href="/spectacles" className="rounded-full border border-navy/20 bg-white/80 px-6 py-3 font-semibold backdrop-blur transition hover:bg-ice">
              Browse spectacles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
