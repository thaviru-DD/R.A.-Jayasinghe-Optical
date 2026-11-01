"use client";

import { useActionState } from "react";
import { saveOfferBanner } from "@/lib/admin-actions";

const field =
  "mt-2 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white";

type OfferValues = {
  enabled: boolean;
  percent: number;
  title: string;
  endsLabel: string;
  href: string;
};

export function OfferBannerForm({ offer }: { offer?: OfferValues | null }) {
  const [state, action, pending] = useActionState(saveOfferBanner, null);

  return (
    <form action={action} className="grid gap-4">
      <label className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-[#f7fbfd] px-4 py-3">
        <input type="checkbox" name="enabled" defaultChecked={offer?.enabled ?? false} />
        <span className="text-sm font-medium">Show offer banners on the homepage</span>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-navy/70">
          Discount percent
          <input
            name="percent"
            type="number"
            min={1}
            max={99}
            required
            defaultValue={offer?.percent ?? 20}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-navy/70">
          Offer ends (display text)
          <input
            name="endsLabel"
            required
            defaultValue={offer?.endsLabel ?? "26 November"}
            placeholder="e.g. 26 November"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-navy/70 md:col-span-2">
          What the offer is on
          <input
            name="title"
            required
            defaultValue={offer?.title ?? "selected eyewear"}
            placeholder="e.g. selected eyewear / all frames & sunglasses"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-navy/70 md:col-span-2">
          Shop now link
          <select name="href" defaultValue={offer?.href ?? "/spectacles"} className={field}>
            <option value="/spectacles">Frames / spectacles</option>
            <option value="/sunglasses">Sunglasses</option>
            <option value="/contact-lenses">Contact lenses</option>
            <option value="/lenses">Lenses</option>
            <option value="/book">Book an eye test</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-[#f7fbfd] px-4 py-3">
        <input type="checkbox" name="syncProducts" />
        <span className="text-sm font-medium">Also apply this % discount to all products</span>
      </label>

      {state?.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-2xl border border-aqua/30 bg-aqua/15 px-4 py-3 font-semibold text-navy" role="status">
          Offer banner saved. Refresh the homepage to see it.
        </p>
      ) : null}

      <button
        disabled={pending}
        className="rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy disabled:opacity-60 md:w-fit"
      >
        {pending ? "Saving…" : "Save offer banner"}
      </button>
    </form>
  );
}
