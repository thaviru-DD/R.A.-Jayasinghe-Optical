import type { Metadata } from "next";
import { FavouritesView } from "@/components/FavouritesView";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Favourites",
  description: "Frames you saved in this browser at R.A. Jayasinghe Opticians.",
};

export default function Page() {
  return (
    <>
      <PageHero
        variant="luxury"
        eyebrow="Favourites"
        title="Saved on this device"
        text="No login is needed. Favourites live in this browser, so they are lost if the browser data is cleared."
      />
      <section className="relative overflow-hidden bg-[#f7fbfd]">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-16">
          <FavouritesView />
        </div>
      </section>
    </>
  );
}
