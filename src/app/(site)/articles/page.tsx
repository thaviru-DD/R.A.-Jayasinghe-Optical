import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Articles",
  description: "Eye care articles and tips from R.A. Jayasinghe Opticians.",
};

export default async function Page() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return (
    <>
      <PageHero
        variant="luxury"
        eyebrow="Articles"
        title="Eye care, written simply"
        text="Quiet guidance from the shop. This is general information, not a diagnosis."
      />
      <section className="relative overflow-hidden bg-[#f7fbfd]">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-[#c4a35a]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-16 md:grid-cols-2 md:py-20">
          {articles.length ? (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group overflow-hidden rounded-[1.8rem] border border-navy/8 bg-white shadow-[0_18px_50px_rgba(3,4,94,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(3,4,94,0.1)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ice">
                  {article.cover ? (
                    <Photo src={article.cover} alt="" className="transition duration-700 group-hover:scale-105" />
                  ) : null}
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">
                    {article.category} · {formatDate(article.date)}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight md:text-3xl">{article.title}</h2>
                  <p className="mt-3 leading-7 text-navy/70">{article.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy transition group-hover:text-[#c4a35a]">
                    Read article
                    <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="rounded-[1.8rem] border border-navy/8 bg-white p-8 text-lg text-navy/70 md:col-span-2">
              Published articles will appear here.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
