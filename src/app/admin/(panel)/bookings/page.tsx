import { BookingBoard } from "@/components/admin/BookingBoard";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { addDays, colomboToday } from "@/lib/format";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const bookings = await prisma.booking.findMany({ orderBy: [{ date: "desc" }, { time: "desc" }] });
  const today = colomboToday();
  return (
    <div>
      <h1 className="font-heading text-4xl font-semibold">Bookings</h1>
      <p className="mt-2 max-w-2xl text-lg">Approve, reject, or reschedule. After each change, message the customer yourself. Nothing is sent automatically.</p>
      {sp.error === "slot" ? <p className="mt-4 rounded-2xl bg-white p-4 font-semibold">That slot is not open. Choose another time.</p> : null}
      {sp.updated ? <p className="mt-4 rounded-2xl bg-white p-4 font-semibold" role="status">The booking was rescheduled. Please tell the customer.</p> : null}
      <div className="mt-6">
        <BookingBoard
          bookings={bookings.map((booking) => ({
            id: booking.id,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            age: booking.age,
            date: booking.date,
            time: booking.time,
            status: booking.status,
          }))}
          today={today}
          max={addDays(today, 30)}
        />
      </div>
    </div>
  );
}

