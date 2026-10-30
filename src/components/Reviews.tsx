"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { createReview } from "@/lib/actions";

type Review = { id: string; name: string; rating: number; comment: string };

function Star({ filled, className = "h-5 w-5" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2.4 14.9 9l7.1.6-5.4 4.6 1.7 6.9L12 17.8 5.7 21.1l1.7-6.9L2 9.6 9.1 9 12 2.4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({ value, size = "h-5 w-5" }: { value: number; size?: string }) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="inline-flex items-center gap-1 text-[#c4a35a]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} filled={star <= value} className={size} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/55">
        Your rating
      </p>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-labelledby={labelId}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className={`rounded-full p-1 transition ${star <= value ? "text-[#c4a35a]" : "text-navy/20 hover:text-[#c4a35a]/70"}`}
            onClick={() => onChange(star)}
          >
            <Star filled={star <= value} className="h-8 w-8" />
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={value} />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Reviews({ reviews, received }: { reviews: Review[]; received: boolean }) {
  const [state, action, pending] = useActionState(createReview, null);
  const [started, setStarted] = useState("");
  const [rating, setRating] = useState(5);
  useEffect(() => setStarted(String(Date.now())), []);

  const average = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#f7fbfd]">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-aqua/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-navy/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-navy/55">Customer reviews</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Quiet praise, carefully chosen
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-navy/75">
              Every review here is approved by the shop. No account needed — just an honest note about your visit.
            </p>
          </div>

          {reviews.length ? (
            <div className="justify-self-start rounded-[2rem] border border-navy/8 bg-white/80 px-6 py-5 shadow-[0_24px_60px_rgba(3,4,94,0.06)] backdrop-blur lg:justify-self-end">
              <div className="flex items-center gap-4">
                <p className="font-heading text-5xl font-semibold tracking-tight">{average.toFixed(1)}</p>
                <div>
                  <Stars value={Math.round(average)} size="h-6 w-6" />
                  <p className="mt-2 text-sm font-medium text-navy/60">
                    Based on {reviews.length} approved review{reviews.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {received || state?.ok ? (
          <p className="mt-8 rounded-[1.4rem] border border-aqua/50 bg-white px-5 py-4 font-semibold text-navy" role="status">
            Thank you. Your review will show here after the shop approves it.
          </p>
        ) : null}

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.length ? (
            reviews.map((review) => (
              <article
                key={review.id}
                className="group relative overflow-hidden rounded-[2rem] border border-navy/8 bg-white p-7 shadow-[0_20px_50px_rgba(3,4,94,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(3,4,94,0.1)]"
              >
                <span className="pointer-events-none absolute -right-2 -top-6 font-heading text-[7rem] leading-none text-navy/[0.04] transition group-hover:text-aqua/20">
                  “
                </span>
                <Stars value={review.rating} />
                <p className="relative mt-5 text-lg leading-8 text-navy/85">{review.comment}</p>
                <div className="mt-8 flex items-center gap-3 border-t border-navy/8 pt-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-heading text-sm font-semibold text-aqua">
                    {initials(review.name) || "R"}
                  </span>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-navy/50">Verified customer</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-lg text-navy/70 md:col-span-2 xl:col-span-3">Approved reviews will appear here.</p>
          )}
        </div>

        <form
          action={action}
          className="mt-14 overflow-hidden rounded-[2.2rem] border border-navy/8 bg-white shadow-[0_24px_60px_rgba(3,4,94,0.06)]"
        >
          <div className="border-b border-navy/8 bg-gradient-to-r from-ice/80 via-white to-aqua/20 px-6 py-6 md:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-navy/55">Share your visit</p>
            <h3 className="mt-2 font-heading text-3xl font-semibold">Leave a review</h3>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <input type="hidden" name="started" value={started} />

            <label className="block">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/55">Name</span>
              <input
                name="name"
                required
                maxLength={80}
                className="mt-3 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-aqua focus:bg-white"
              />
            </label>

            <StarPicker value={rating} onChange={setRating} />

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/55">Comment</span>
              <textarea
                name="comment"
                required
                minLength={4}
                maxLength={800}
                rows={4}
                className="mt-3 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-aqua focus:bg-white"
              />
            </label>

            {state?.error ? <p className="font-semibold text-navy md:col-span-2">{state.error}</p> : null}

            <button
              disabled={pending}
              className="btn-shine rounded-full bg-navy px-7 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy disabled:opacity-60 md:col-span-2 md:w-fit"
            >
              {pending ? "Sending…" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
