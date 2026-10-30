"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-4xl font-semibold">Something went wrong</h1>
      <p className="mt-4 text-lg">Please try that again.</p>
      <button type="button" onClick={reset} className="mt-8 rounded-full bg-navy px-6 py-3 font-semibold text-white">Try again</button>
    </div>
  );
}
