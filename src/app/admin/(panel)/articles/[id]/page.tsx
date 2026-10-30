import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { prisma } from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const article = await prisma.article.findUnique({ where: { id: (await params).id } });
  if (!article) notFound();
  return (
    <div>
      <h1 className="mb-6 font-heading text-4xl font-semibold">Edit article</h1>
      <ArticleForm
        article={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          content: article.content,
          date: article.date,
          published: article.published,
          cover: article.cover,
        }}
      />
    </div>
  );
}
