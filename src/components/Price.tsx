import { formatLkr, salePrice } from "@/lib/format";

export function PriceTag({
  product,
}: {
  product: { price: number; showDiscount: boolean; discountType: string | null; discountValue: number | null };
}) {
  const sale = salePrice(product);
  if (sale == null) {
    return <span className="font-heading text-lg font-semibold tracking-tight text-navy">{formatLkr(product.price)}</span>;
  }
  const badge = product.discountType === "percent" && product.discountValue ? `${product.discountValue}% off` : "Offer";
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2">
      <span className="font-heading text-lg font-semibold tracking-tight text-navy">{formatLkr(sale)}</span>
      <span className="text-sm text-navy/40 line-through">{formatLkr(product.price)}</span>
      <span className="rounded-full bg-[#c4a35a]/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c4a35a]">
        {badge}
      </span>
    </span>
  );
}
