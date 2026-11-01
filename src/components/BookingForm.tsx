"use client";

import { useActionState, useEffect, useState } from "react";
import { createBooking } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { shop, whatsappLink } from "@/lib/site";

type Slot = { time: string; label: string; available: boolean };

const field =
  "mt-2 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white";

export function BookingForm({
  date,
  slots,
  today,
  max,
}: {
  date: string;
  slots: Slot[];
  today: string;
  max: string;
}) {
  const [state, action, pending] = useActionState(createBooking, null);
  const [started, setStarted] = useState("");
  const [time, setTime] = useState(slots.find((slot) => slot.available)?.time ?? "");
  useEffect(() => setStarted(String(Date.now())), []);

  return (
    <form
      action={action}
      className="relative grid gap-5 overflow-hidden rounded-[2rem] border border-navy/8 bg-white p-5 shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:p-7"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/45 to-transparent" />

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Your details</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Booking for {formatDate(date)}
        </h2>
        <div className="mt-4 h-px w-20 bg-gradient-to-r from-[#c4a35a] to-transparent" />
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="started" value={started} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-navy/70 md:col-span-2">
          Patient name
          <input name="name" required maxLength={80} className={field} />
        </label>
        <label className="block text-sm font-medium text-navy/70">
          Telephone number
          <input name="phone" required inputMode="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-navy/70">
          Age
          <input name="age" type="number" required min={1} max={120} className={field} />
        </label>
        <label className="block text-sm font-medium text-navy/70 md:col-span-2">
          Email address
          <input name="email" type="email" required className={field} />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-navy/70">30-minute time slot</legend>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {slots.map((slot) => {
            const selected = time === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                aria-pressed={selected}
                onClick={() => setTime(slot.time)}
                className={`rounded-2xl border px-3 py-3.5 text-left transition ${
                  selected
                    ? "border-[#c4a35a]/50 bg-navy text-white shadow-[0_12px_28px_rgba(3,4,94,0.18)]"
                    : slot.available
                      ? "border-navy/10 bg-[#f7fbfd] text-navy hover:border-[#c4a35a]/35 hover:bg-white"
                      : "border-transparent bg-navy/[0.03] text-navy/35 line-through"
                }`}
              >
                <span className="block font-semibold">{slot.label}</span>
                {!slot.available ? (
                  <span className="mt-1 block text-xs font-medium no-underline tracking-wide">Booked</span>
                ) : selected ? (
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">
                    Selected
                  </span>
                ) : (
                  <span className="mt-1 block text-xs font-medium text-navy/45">Available</span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {state?.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-2xl border border-aqua/30 bg-aqua/15 px-4 py-3 font-semibold text-navy" role="status">
          Your request has been received.
        </p>
      ) : null}

      <button
        disabled={pending || !time}
        className="rounded-full bg-navy px-7 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy disabled:opacity-60 md:w-fit"
      >
        {pending ? "Saving…" : "Request this slot"}
      </button>

      <p className="text-sm leading-7 text-navy/60">
        The booking is saved as Pending. The shop confirms it by WhatsApp or email. To cancel or change it, message us on{" "}
        <a
          className="font-semibold text-navy underline decoration-[#c4a35a] decoration-2 underline-offset-4 transition hover:text-[#c4a35a]"
          href={whatsappLink(`Hello ${shop.name}, I need to change or cancel an eye test booking.`)}
        >
          WhatsApp
        </a>
        . Bookings are open from {today} until {max}.
      </p>
    </form>
  );
}
