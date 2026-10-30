"use client";

import { useState } from "react";
import { Photo } from "@/components/Photo";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];
  if (!src) return null;

  function move(step: number) {
    setActive((current) => (current + step + images.length) % images.length);
  }

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-[2rem] bg-ice"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
        aria-label={`${name} photos. Use the arrow keys to change photo.`}
      >
        <Photo src={src} alt={`${name}, photo ${active + 1} of ${images.length}`} sizes="(min-width: 1024px) 45vw, 100vw" priority />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === active}
            className={`relative aspect-square overflow-hidden rounded-2xl bg-ice ${index === active ? "ring-4 ring-aqua" : "ring-1 ring-navy/10"}`}
          >
            <Photo src={image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
