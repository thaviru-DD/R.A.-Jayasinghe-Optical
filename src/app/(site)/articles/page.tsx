import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Articles", description: "Eye care articles and tips from R.A. Jayasinghe Opticians." };

export default async function Page() {
  const articles = await prisma.article.findMany({ where: { published: true }, orderBy: { date: "desc" } });
  return (
    <>
      <PageHero eyebrow="Articles" title="Eye care, written simply" text="Tips from the shop. This is general information, not a diagnosis." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="overflow-hidden rounded-[1.7rem] border border-navy/10 bg-white">
            <div className="relative aspect-[16/9] bg-ice">
              {article.cover ? <Photo src={article.cover} alt="" /> : null}
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">{article.category} · {formatDate(article.date)}</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">{article.title}</h2>
              <p className="mt-2">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
