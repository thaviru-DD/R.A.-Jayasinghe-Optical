import { deleteHoliday, saveHoliday } from "@/lib/admin-actions";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function Page() {
  const holidays = await prisma.holiday.findMany({ orderBy: { date: "asc" } });
  return (
    <div>
      <h1 className="font-heading text-4xl font-semibold">Holidays</h1>
      <p className="mt-2 max-w-2xl text-lg">Poya days are already listed. Add any other day the shop is closed. Those dates cannot be booked.</p>
      <form action={saveHoliday} className="mt-6 flex flex-wrap items-end gap-3 rounded-[1.4rem] bg-white p-4">
        <label>Date<input type="date" name="date" required className="mt-1 block rounded-2xl border border-navy/15 px-4 py-3" /></label>
        <label>Reason<input name="reason" required className="mt-1 block rounded-2xl border border-navy/15 px-4 py-3" /></label>
        <button className="rounded-full bg-navy px-5 py-3 font-semibold text-white">Save holiday</button>
      </form>
      <ul className="mt-6 grid gap-2">
        {holidays.map((holiday) => (
          <li key={holiday.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
            <span>{formatDate(holiday.date)} · {holiday.reason}</span>
            <form action={deleteHoliday}><input type="hidden" name="id" value={holiday.id} /><button className="font-semibold">Remove</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
