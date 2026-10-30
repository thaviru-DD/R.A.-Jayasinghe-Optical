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
        eyebrow="Eye test"
        title="Book a 30-minute appointment"
        text="No account is needed. Each slot takes one patient. You can book up to 30 days ahead. The shop is closed on Poya days."
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          {sp.sent === "1" ? (
            <p className="mb-6 rounded-[1.4rem] bg-ice p-5 text-lg" role="status">
              Your eye test request is saved as Pending. We will confirm by WhatsApp or email. To change or cancel, message the shop on WhatsApp.
            </p>
          ) : null}
          <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
            <label className="block">Preferred date
              <input type="date" name="date" required min={today} max={max} defaultValue={date} className="mt-1 rounded-2xl border border-navy/15 px-4 py-3" />
            </label>
            <button className="rounded-full bg-aqua px-5 py-3 font-semibold text-navy" type="submit">Show times</button>
          </form>
          {availability.ok ? (
            availability.slots.length ? (
              <BookingForm date={date} slots={availability.slots} today={formatDate(today)} max={formatDate(max)} />
            ) : (
              <p className="rounded-[1.4rem] bg-ice p-5 text-lg">There are no times left on this day. Please choose another date.</p>
            )
          ) : (
            <p className="rounded-[1.4rem] bg-ice p-5 text-lg">{availability.reason}</p>
          )}
        </div>
        <aside className="h-fit rounded-[1.6rem] bg-ice p-6">
          <h2 className="font-heading text-2xl font-semibold">Opening hours</h2>
          <ul className="mt-4 space-y-2">
            {shop.hours.map((item) => <li key={item.days}><span className="font-semibold">{item.days}:</span> {item.hours}</li>)}
          </ul>
          <p className="mt-3">{shop.closedNote}</p>
          <p className="mt-4">Appointments are 30 minutes. One patient per slot.</p>
          <Link className="mt-4 inline-flex font-semibold underline decoration-aqua decoration-2" href={whatsappLink(`Hello ${shop.name}, I need to change or cancel an eye test booking.`)}>
            Change a booking on WhatsApp
          </Link>
        </aside>
      </div>
    </>
  );
}
