"use client";

import { useActionState } from "react";
import { saveBanner } from "@/lib/admin-actions";

export function BannerForm({ banner }: { banner?: { id: string; text: string; link: string | null; image: string | null; startDate: string; endDate: string } }) {
  const [state, action, pending] = useActionState(saveBanner, null);
  const field = "mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3";
  return (
    <form action={action} className="grid gap-3 rounded-[1.4rem] bg-white p-5">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}
      <input type="hidden" name="currentImage" value={banner?.image || ""} />
      <label>Text<textarea name="text" required defaultValue={banner?.text} className={field} /></label>
      <label>Link<input name="link" defaultValue={banner?.link || ""} placeholder="/book" className={field} /></label>
      <label>Start<input type="date" name="startDate" required defaultValue={banner?.startDate} className={field} /></label>
      <label>End<input type="date" name="endDate" required defaultValue={banner?.endDate} className={field} /></label>
      {banner?.image ? <label className="flex items-center gap-2"><input type="checkbox" name="removeImage" /> Remove current image</label> : null}
      <label>Image<input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="mt-1 block" /></label>
      {state?.error ? <p className="font-semibold">{state.error}</p> : null}
      <button disabled={pending} className="rounded-full bg-navy px-5 py-3 font-semibold text-white">{banner ? "Update banner" : "Create banner"}</button>
    </form>
  );
}
