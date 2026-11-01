import Link from "next/link";
import type { SiteOffer } from "@/lib/products";

export function PromoOffer({
  offer,
  tone = "light",
  className = "",
}: {
  offer: SiteOffer | null;
  tone?: "light" | "dark" | "gold";
  className?: string;
}) {
  if (!offer) return null;

  const styles =
    tone === "dark"
      ? "border-white/15 bg-white/[0.06] text-white"
      : tone === "gold"
        ? "border-[#c4a35a]/35 bg-[#c4a35a]/12 text-navy"
        : "border-[#c4a35a]/25 bg-white text-navy shadow-[0_16px_40px_rgba(3,4,94,0.06)]";

  const muted = tone === "dark" ? "text-white/70" : "text-navy/70";
  const accent = "text-[#c4a35a]";
  const link = tone === "dark" ? "text-aqua hover:text-white" : "text-navy hover:text-[#c4a35a]";
  const label = `${offer.percent}%`;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border px-5 py-4 md:px-6 ${styles} ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#c4a35a] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#02033a]">
          {label} off
        </span>
        <p className={`text-sm font-medium md:text-base ${muted}`}>
          Enjoy <span className={`font-semibold ${accent}`}>{label} off</span> {offer.title}
          {offer.endsLabel ? (
            <>
              {" "}
              — offer ends <span className="font-semibold">{offer.endsLabel}</span>
            </>
          ) : null}
        </p>
      </div>
      <Link href={offer.href} className={`text-sm font-semibold transition ${link}`}>
        Shop now →
      </Link>
    </div>
  );
}
