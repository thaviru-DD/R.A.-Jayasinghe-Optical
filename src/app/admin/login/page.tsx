"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <main id="content" className="grid min-h-screen place-items-center bg-ice px-4">
      <form action={action} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(3,4,94,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">Admin</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Owner login</h1>
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label className="mt-6 block">Username
          <input name="username" required autoComplete="username" className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
        </label>
        <label className="mt-4 block">Password
          <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3" />
        </label>
        {state?.error ? <p className="mt-4 font-semibold" role="alert">{state.error}</p> : null}
        <button disabled={pending} className="mt-6 w-full rounded-full bg-navy py-3 font-semibold text-white">{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
