"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { Photo } from "@/components/Photo";

type LensTurnCardProps = {
  name: string;
  description: string;
  image: string;
  index?: number;
  selected?: boolean;
  onSelect?: () => void;
};

export function LensTurnCard({
  name,
  description,
  image,
  index = 0,
  selected = false,
  onSelect,
}: LensTurnCardProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateXSpring = useSpring(useTransform(mouseY, [0, 1], [16, -16]), {
    stiffness: 220,
    damping: 22,
    mass: 0.4,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [0, 1], [-22, 22]), {
    stiffness: 220,
    damping: 22,
    mass: 0.4,
  });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.95", "end 0.05"],
  });

  const scrollStart = index % 2 === 0 ? -34 : 34;
  const scrollEnd = index % 2 === 0 ? 18 : -18;

  const scrollRotateYRaw = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42, 0.62, 0.82, 1],
    [scrollStart, scrollStart * 0.72, scrollStart * 0.22, 0, scrollEnd * 0.45, scrollEnd],
  );
  const scrollRotateXRaw = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [14, 10, 4, 0, -4, -9],
  );
  const scrollScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [0.88, 0.94, 1, 0.98, 0.95],
  );

  const scrollRotateY = useSpring(scrollRotateYRaw, { stiffness: 48, damping: 28, mass: 1.1 });
  const scrollRotateX = useSpring(scrollRotateXRaw, { stiffness: 48, damping: 28, mass: 1.1 });
  const scrollScale = useSpring(scrollScaleRaw, { stiffness: 42, damping: 26, mass: 1.15 });

  const combinedRotateX = useTransform([rotateXSpring, scrollRotateX], ([mouse, scroll]) => Number(mouse) + Number(scroll));
  const combinedRotateY = useTransform([rotateYSpring, scrollRotateY], ([mouse, scroll]) => Number(mouse) + Number(scroll));
  const imageRotateY = useTransform(combinedRotateY, (value) => value * -0.4);

  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), transparent 45%)`;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const body = (
    <>
      <div
        className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#e8f7fb] via-ice to-[#d9eef8]"
        style={{ transform: "translateZ(28px)" }}
      >
        {reduce ? (
          <div className="absolute inset-0">
            <Photo src={image} alt={name} className="object-cover" />
          </div>
        ) : (
          <motion.div className="absolute inset-[-10%] will-change-transform" style={{ rotateY: imageRotateY, scale: 1.1 }}>
            <Photo src={image} alt={name} className="object-cover" />
          </motion.div>
        )}
        {!reduce ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: glareBackground, opacity: 0.55 }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/20 via-transparent to-white/10" />
      </div>

      <div className="relative p-6" style={{ transform: "translateZ(40px)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Lens brand</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight">{name}</h3>
        <p className="mt-2 line-clamp-3 text-navy/75">{description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy transition group-hover:text-[#c4a35a]">
          {selected ? "Hide details" : "Read details"}
          <span aria-hidden className="transition duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </>
  );

  if (reduce) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`group block w-full overflow-hidden rounded-[1.8rem] border bg-white text-left shadow-[0_18px_50px_rgba(3,4,94,0.06)] transition ${
          selected ? "border-[#c4a35a]/50" : "border-navy/8"
        }`}
      >
        {body}
      </button>
    );
  }

  return (
    <div ref={cardRef} className="[perspective:1200px]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        style={{
          rotateX: combinedRotateX,
          rotateY: combinedRotateY,
          scale: scrollScale,
          transformStyle: "preserve-3d",
        }}
        className={`group relative block w-full overflow-hidden rounded-[1.8rem] border bg-white text-left shadow-[0_24px_60px_rgba(3,4,94,0.1)] will-change-transform ${
          selected ? "border-[#c4a35a]/55" : "border-navy/8"
        }`}
      >
        {body}
      </motion.button>
    </div>
  );
}
