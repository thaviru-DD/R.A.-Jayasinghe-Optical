import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { PageHero } from "@/components/PageHero";
import { addDays, colomboToday, formatDate } from "@/lib/format";
import { getOpenSlots, nextOpenDate } from "@/lib/slots";
import { shop, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book an eye test",
  description: "Book a 30-minute eye test at R.A. Jayasinghe Opticians. No login needed.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string; sent?: string }> }) {
  const sp = await searchParams;
  const today = colomboToday();
  const max = addDays(today, 30);
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : await nextOpenDate(today);
  const availability = await getOpenSlots(date);

  return (
    <>
      <PageHero
        variant="luxury"
        eyebrow="Eye test"
        title="Book a quiet 30-minute appointment"
        text="No account needed. One patient per slot. Choose a day up to 30 days ahead — we confirm by WhatsApp or email."
      />

      <section className="relative overflow-hidden bg-[#f7fbfd]">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-20">
          <div className="min-w-0 space-y-6">
            {sp.sent === "1" ? (
              <p
                className="rounded-[1.8rem] border border-aqua/30 bg-aqua/15 px-5 py-4 text-base leading-7 text-navy md:px-6"
                role="status"
              >
                Your eye test request is saved as <span className="font-semibold">Pending</span>. We will confirm by
                WhatsApp or email. To change or cancel, message the shop on WhatsApp.
              </p>
            ) : null}

            <div className="rounded-[2rem] border border-navy/8 bg-white p-5 shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Choose a day</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight md:text-3xl">Preferred date</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-navy/60">
                Open from {formatDate(today)} until {formatDate(max)}. Closed on Poya days.
              </p>
              <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
                <label className="block min-w-[14rem] flex-1 text-sm font-medium text-navy/70">
                  Date
                  <input
                    type="date"
                    name="date"
                    required
                    min={today}
                    max={max}
                    defaultValue={date}
                    className="mt-2 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white"
                  />
                </label>
                <button
                  className="rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy"
                  type="submit"
                >
                  Show times
                </button>
              </form>
            </div>

            {availability.ok ? (
              availability.slots.length ? (
                <BookingForm date={date} slots={availability.slots} today={formatDate(today)} max={formatDate(max)} />
              ) : (
                <p className="rounded-[1.8rem] border border-navy/8 bg-white p-6 text-lg leading-8 text-navy/70 shadow-[0_16px_40px_rgba(3,4,94,0.04)]">
                  There are no times left on this day. Please choose another date.
                </p>
              )
            ) : (
              <p className="rounded-[1.8rem] border border-navy/8 bg-white p-6 text-lg leading-8 text-navy/70 shadow-[0_16px_40px_rgba(3,4,94,0.04)]">
                {availability.reason}
              </p>
            )}
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[2rem] border border-navy/8 bg-white p-6 shadow-[0_18px_50px_rgba(3,4,94,0.05)] md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Visit details</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Opening hours</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-navy/70">
                {shop.hours.map((item) => (
                  <li key={item.days} className="flex flex-col gap-0.5 border-b border-navy/8 pb-3 last:border-0 last:pb-0">
                    <span>{item.days}</span>
                    <span className="font-medium text-navy">{item.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-medium text-[#c4a35a]">{shop.closedNote}</p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#02033a] p-6 text-white shadow-[0_18px_50px_rgba(3,4,94,0.18)] md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Good to know</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/70">
                <li>Each appointment is 30 minutes.</li>
                <li>One patient per time slot.</li>
                <li>No login or online payment.</li>
              </ul>
              <Link
                className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[#c4a35a] transition hover:text-aqua"
                href={whatsappLink(`Hello ${shop.name}, I need to change or cancel an eye test booking.`)}
              >
                Change on WhatsApp →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
