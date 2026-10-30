"use client";

import { useActionState, useEffect, useState } from "react";
import { createReview } from "@/lib/actions";

type Review = { id: string; name: string; rating: number; comment: string };

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="text-navy">
      {"●".repeat(value)}
      <span className="text-navy/25">{"●".repeat(5 - value)}</span>
    </span>
  );
}

export function Reviews({ reviews, received }: { reviews: Review[]; received: boolean }) {
  const [state, action, pending] = useActionState(createReview, null);
  const [started, setStarted] = useState("");
  useEffect(() => setStarted(String(Date.now())), []);

  return (
    <section id="reviews" className="bg-ice">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.22em]">Customer reviews</p>
        <h2 className="mt-3 font-heading text-4xl font-semibold">Kind words, after we check them</h2>
        <p className="mt-3 max-w-2xl text-lg">A new review appears here only after the shop approves it. No account is needed.</p>
        {received || state?.ok ? (
          <p className="mt-6 rounded-2xl bg-white px-4 py-3 font-semibold" role="status">
            Thank you. Your review will show here after the shop approves it.
          </p>
        ) : null}
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {reviews.length ? reviews.map((review) => (
            <article key={review.id} className="min-w-[280px] flex-1 rounded-[1.6rem] bg-white p-6 shadow-[0_16px_40px_rgba(3,4,94,0.06)]">
              <Stars value={review.rating} />
              <p className="mt-4 text-lg leading-8">{review.comment}</p>
              <p className="mt-4 font-semibold">{review.name}</p>
            </article>
          )) : <p className="text-lg">Approved reviews will appear here.</p>}
        </div>
        <form action={action} className="mt-8 grid gap-4 rounded-[1.8rem] bg-white p-6 md:grid-cols-2">
          <h3 className="font-heading text-2xl font-semibold md:col-span-2">Leave a review</h3>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <input type="hidden" name="started" value={started} />
          <label className="block">Name
            <input name="name" required maxLength={80} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
          </label>
          <label className="block">Star rating
            <select name="rating" required defaultValue="5" className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value === 1 ? "1 star" : `${value} stars`}</option>)}
            </select>
          </label>
          <label className="block md:col-span-2">Comment
            <textarea name="comment" required minLength={4} maxLength={800} rows={4} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
          </label>
          {state?.error ? <p className="md:col-span-2 font-semibold">{state.error}</p> : null}
          <button disabled={pending} className="rounded-full bg-navy px-6 py-3 font-semibold text-white disabled:opacity-60 md:col-span-2 md:w-fit">
            {pending ? "Sending…" : "Submit review"}
          </button>
        </form>
      </div>
    </section>
  );
}
