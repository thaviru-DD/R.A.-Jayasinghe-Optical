"use client";

import { useEffect, useRef, useState } from "react";

export function CountUpStat({
  value,
  label,
  suffix = "",
  duration = 1800,
}: {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <div ref={ref} className="rounded-[1.4rem] border border-navy/8 bg-white/80 px-4 py-4 shadow-[0_12px_30px_rgba(3,4,94,0.04)]">
      <dt className="font-heading text-3xl font-semibold tracking-tight text-navy">
        {display.toLocaleString("en-LK")}
        {suffix}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-navy/60">{label}</dd>
    </div>
  );
}
