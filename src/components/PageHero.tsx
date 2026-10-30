export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
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
