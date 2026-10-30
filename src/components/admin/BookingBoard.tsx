"use client";

import { useState } from "react";
import { rescheduleBooking, setBookingStatus } from "@/lib/admin-actions";
import { fetchSlots } from "@/lib/actions";
import { formatDate, formatTime } from "@/lib/format";
import { phoneToWa, shop, whatsappLink } from "@/lib/site";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  date: string;
  time: string;
  status: string;
};

export function BookingBoard({ bookings, today, max }: { bookings: Booking[]; today: string; max: string }) {
  const [slots, setSlots] = useState<Record<string, { time: string; label: string; available: boolean }[]>>({});

  async function load(id: string, date: string) {
    const result = await fetchSlots(date, id);
    setSlots((current) => ({ ...current, [id]: result.ok ? result.slots : [] }));
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => {
        const note = `Hello ${booking.name}, your eye test at ${shop.name} on ${formatDate(booking.date)} at ${formatTime(booking.time)} is ${booking.status}.`;
        return (
          <article key={booking.id} className="rounded-[1.4rem] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold">{booking.name}</h2>
                <p>{formatDate(booking.date)} at {formatTime(booking.time)} · age {booking.age}</p>
                <p>{booking.phone} · {booking.email}</p>
              </div>
              <span className="rounded-full bg-ice px-3 py-1 font-semibold capitalize">{booking.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {booking.status !== "approved" ? (
                <form action={setBookingStatus}><input type="hidden" name="id" value={booking.id} /><input type="hidden" name="status" value="approved" /><button className="rounded-full bg-aqua px-4 py-2 font-semibold">Approve</button></form>
              ) : null}
              {booking.status !== "rejected" ? (
                <form action={setBookingStatus}><input type="hidden" name="id" value={booking.id} /><input type="hidden" name="status" value="rejected" /><button className="rounded-full border border-navy/20 px-4 py-2 font-semibold">Reject</button></form>
              ) : null}
              <a className="rounded-full bg-navy px-4 py-2 font-semibold text-white" href={whatsappLink(note, phoneToWa(booking.phone))}>WhatsApp</a>
              <a className="rounded-full bg-ice px-4 py-2 font-semibold" href={`mailto:${booking.email}?subject=${encodeURIComponent("Your eye test at " + shop.name)}&body=${encodeURIComponent(note)}`}>Email</a>
            </div>
            <form action={rescheduleBooking} className="mt-4 grid gap-3 rounded-2xl bg-ice p-4 md:grid-cols-[1fr_1fr_auto]">
              <input type="hidden" name="id" value={booking.id} />
              <label>New date
                <input name="date" type="date" required min={today} max={max} defaultValue={booking.date} className="mt-1 w-full rounded-2xl px-3 py-3" onChange={(event) => load(booking.id, event.target.value)} />
              </label>
              <label>New time
                <select name="time" required className="mt-1 w-full rounded-2xl px-3 py-3" defaultValue={booking.time}>
                  <option value={booking.time}>{formatTime(booking.time)} (current)</option>
                  {(slots[booking.id] || []).filter((slot) => slot.available && slot.time !== booking.time).map((slot) => (
                    <option key={slot.time} value={slot.time}>{slot.label}</option>
                  ))}
                </select>
              </label>
              <button className="self-end rounded-full bg-navy px-4 py-3 font-semibold text-white">Reschedule</button>
            </form>
            <p className="mt-2">Change the date to load open times. Then tell the customer yourself on WhatsApp or email. The website does not send that message.</p>
          </article>
        );
      })}
    </div>
  );
}
