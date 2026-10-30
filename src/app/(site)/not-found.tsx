import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em]">404</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold">That page is not on the shelf</h1>
      <p className="mt-4 text-lg">The link may be old, or the product may have been hidden.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-navy px-6 py-3 font-semibold text-white">Back home</Link>
    </div>
  );
}
