"use client";

import { useEffect, useState } from "react";
import { readFavourites, toggleFavourite } from "@/lib/favourites";

export function FavouriteButton({ id, name }: { id: string; name: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readFavourites().includes(id));
    sync();
    window.addEventListener("favourites:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("favourites:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      onClick={() => setSaved(toggleFavourite(id))}
      className={`grid h-11 w-11 place-items-center rounded-full border transition ${saved ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:bg-ice"}`}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${saved ? "scale-110" : ""}`} fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
      </svg>
    </button>
  );
}
