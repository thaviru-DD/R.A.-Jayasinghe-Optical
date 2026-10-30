import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Photo } from "@/components/Photo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await prisma.article.findFirst({
    where: { slug: (await params).slug, published: true },
  });
  if (!article) return { title: "Article" };
  return { title: article.title, description: article.excerpt };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const article = await prisma.article.findFirst({
    where: { slug: (await params).slug, published: true },
  });
  if (!article) notFound();

  return (
    <article className="relative overflow-hidden bg-[#f7fbfd]">
      <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-aqua/20 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 py-14 md:py-20">
        <Link
          href="/articles"
          className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c4a35a] transition hover:text-navy"
        >
          ← Articles
        </Link>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy/50">
          {article.category} · {formatDate(article.date)}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">{article.title}</h1>
        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#c4a35a] to-transparent" />
        <p className="mt-5 text-lg leading-8 text-navy/70">{article.excerpt}</p>
        {article.cover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[1.8rem] border border-navy/8 bg-white shadow-[0_18px_50px_rgba(3,4,94,0.06)]">
            <Photo src={article.cover} alt="" priority />
          </div>
        ) : null}
        <div className="mt-10 space-y-5 rounded-[1.8rem] border border-navy/8 bg-white p-6 text-lg leading-8 text-navy/80 shadow-[0_16px_40px_rgba(3,4,94,0.04)] md:p-8">
          {article.content.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
