import type { Metadata } from "next";
import { FavouritesView } from "@/components/FavouritesView";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Favourites", description: "Frames you saved in this browser at R.A. Jayasinghe Opticians." };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Favourites" title="Saved on this device" text="No login is needed. Favourites live in this browser, so they are lost if the browser data is cleared." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <FavouritesView />
      </div>
    </>
  );
}
