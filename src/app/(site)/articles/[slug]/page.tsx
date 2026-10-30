import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Photo } from "@/components/Photo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await prisma.article.findFirst({ where: { slug: (await params).slug, published: true } });
  if (!article) return { title: "Article" };
  return { title: article.title, description: article.excerpt };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const article = await prisma.article.findFirst({ where: { slug: (await params).slug, published: true } });
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.16em]">{article.category} · {formatDate(article.date)}</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold">{article.title}</h1>
      <p className="mt-4 text-lg">{article.excerpt}</p>
      {article.cover ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.6rem] bg-ice">
          <Photo src={article.cover} alt="" priority />
        </div>
      ) : null}
      <div className="mt-8 space-y-4 text-lg leading-8">
        {article.content.split(/\n\n+/).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
      </div>
    </article>
  );
}
