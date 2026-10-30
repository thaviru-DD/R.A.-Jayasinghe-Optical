import { prisma } from "@/lib/db";
import { addDays, colomboTime, colomboToday, formatTime, weekday } from "@/lib/format";

export const BLOCKING_STATUSES = ["pending", "approved", "rescheduled"] as const;

export function slotsForDate(iso: string) {
  const day = weekday(iso);
  const end = day === 0 ? 13 * 60 + 30 : day === 6 ? 18 * 60 : 19 * 60;
  const slots: string[] = [];
  for (let minute = 9 * 60 + 30; minute + 30 <= end; minute += 30) {
    const hour = Math.floor(minute / 60);
    const mins = minute % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(mins).padStart(2, "0")}`);
  }
  return slots;
}

export async function getOpenSlots(date: string, ignoreId?: string) {
  const today = colomboToday();
  const max = addDays(today, 30);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || date > max) {
    return { ok: false as const, reason: "You can book up to 30 days ahead, starting from today." };
  }

  const holiday = await prisma.holiday.findUnique({ where: { date } });
  if (holiday) return { ok: false as const, reason: `The shop is closed: ${holiday.reason}` };

  const taken = new Set(
    (
      await prisma.booking.findMany({
        where: {
          date,
          status: { in: [...BLOCKING_STATUSES] },
          ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
        },
        select: { time: true },
      })
    ).map((booking) => booking.time),
  );

  const now = colomboTime();
  const slots = slotsForDate(date)
    .filter((time) => date !== today || time > now)
    .map((time) => ({ time, label: formatTime(time), available: !taken.has(time) }));

  return { ok: true as const, slots };
}

export async function nextOpenDate(start = colomboToday()) {
  for (let offset = 0; offset <= 30; offset += 1) {
    const date = addDays(start, offset);
    const result = await getOpenSlots(date);
    if (result.ok && result.slots.some((slot) => slot.available)) return date;
  }
  return addDays(start, 1);
}
