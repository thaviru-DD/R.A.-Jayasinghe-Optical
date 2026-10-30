import Link from "next/link";
import { deleteArticle } from "@/lib/admin-actions";
import { prisma } from "@/lib/db";

export default async function Page() {
  const articles = await prisma.article.findMany({ orderBy: { date: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-4xl font-semibold">Articles</h1>
        <Link href="/admin/articles/new" className="rounded-full bg-navy px-5 py-3 font-semibold text-white">New article</Link>
      </div>
      <div className="mt-6 grid gap-3">
        {articles.map((article) => (
          <article key={article.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
            <div>
              <p className="font-semibold">{article.title}</p>
              <p>{article.published ? "Published" : "Draft"} · {article.date}</p>
            </div>
            <div className="flex gap-3">
              <Link className="font-semibold underline" href={`/admin/articles/${article.id}`}>Edit</Link>
              <form action={deleteArticle}><input type="hidden" name="id" value={article.id} /><button className="font-semibold">Delete</button></form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
