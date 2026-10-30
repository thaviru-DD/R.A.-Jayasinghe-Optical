"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/admin-actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="rounded-[1.5rem] bg-white p-5">
      <h2 className="font-heading text-2xl font-semibold">Change your password</h2>
      <label className="mt-4 block">Current password
        <input name="current" type="password" required className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <label className="mt-3 block">New password
        <input name="next" type="password" required minLength={8} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      <label className="mt-3 block">Confirm new password
        <input name="confirm" type="password" required minLength={8} className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
      </label>
      {state?.error ? <p className="mt-3 font-semibold">{state.error}</p> : null}
      {state?.ok ? <p className="mt-3 font-semibold" role="status">Password updated.</p> : null}
      <button disabled={pending} className="mt-4 rounded-full bg-navy px-5 py-3 font-semibold text-white">Update password</button>
    </form>
  );
}
