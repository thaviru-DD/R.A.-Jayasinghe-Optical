"use client";

import { useActionState, useEffect, useState } from "react";
import { createBooking } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { shop, whatsappLink } from "@/lib/site";

type Slot = { time: string; label: string; available: boolean };

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
    <form action={action} className="grid gap-4 rounded-[1.8rem] bg-white p-6 shadow-[0_18px_50px_rgba(3,4,94,0.06)]">
      <h2 className="font-heading text-2xl font-semibold">Your details for {formatDate(date)}</h2>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="started" value={started} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />
      <label>Patient name
        <input name="name" required maxLength={80} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <label>Telephone number
        <input name="phone" required inputMode="tel" className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <label>Email address
        <input name="email" type="email" required className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <label>Age
        <input name="age" type="number" required min={1} max={120} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <fieldset>
        <legend className="font-semibold">30-minute time slot</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              aria-pressed={time === slot.time}
              onClick={() => setTime(slot.time)}
              className={`rounded-2xl px-3 py-3 font-semibold ${time === slot.time ? "bg-navy text-white" : slot.available ? "bg-ice" : "bg-white text-navy/35 line-through"}`}
            >
              {slot.label}
              {!slot.available ? <span className="block text-sm font-medium no-underline">Booked</span> : null}
            </button>
          ))}
        </div>
      </fieldset>
      {state?.error ? <p className="font-semibold" role="alert">{state.error}</p> : null}
      {state?.ok ? <p role="status">Your request has been received.</p> : null}
      <button disabled={pending || !time} className="rounded-full bg-navy px-6 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? "Saving…" : "Request this slot"}
      </button>
      <p className="text-base leading-7">
        The booking is saved as Pending. The shop confirms it by WhatsApp or email. To cancel or change it, message us on{" "}
        <a className="font-semibold underline decoration-aqua decoration-2" href={whatsappLink(`Hello ${shop.name}, I need to change or cancel an eye test booking.`)}>WhatsApp</a>.
        Bookings are open from {today} until {max}.
      </p>
    </form>
  );
}
