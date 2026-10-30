export function PageHero({
  eyebrow,
  title,
  text,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  variant?: "default" | "luxury";
}) {
  if (variant === "luxury") {
    return (
      <section className="relative overflow-hidden bg-[#02033a] text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#c4a35a]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a35a]/55 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <p className="rise text-xs font-semibold uppercase tracking-[0.3em] text-[#c4a35a]">{eyebrow}</p>
          <h1 className="rise delay-1 mt-4 max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">
            {title}
          </h1>
          <div className="rise delay-1 mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
          {text ? (
            <p className="rise delay-2 mt-5 max-w-2xl text-lg leading-8 text-white/70">{text}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-ice">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-aqua/70" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-16">
        <p className="rise text-sm font-semibold uppercase tracking-[0.22em] text-navy/70">{eyebrow}</p>
        <h1 className="rise delay-1 mt-3 max-w-3xl font-heading text-4xl font-semibold text-navy md:text-5xl">{title}</h1>
        {text ? <p className="rise delay-2 mt-4 max-w-2xl text-lg leading-8">{text}</p> : null}
      </div>
    </section>
  );
}
