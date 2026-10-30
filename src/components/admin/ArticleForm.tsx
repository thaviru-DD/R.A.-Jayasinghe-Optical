"use client";

import { useActionState } from "react";
import { saveArticle } from "@/lib/admin-actions";

type Article = { id?: string; title: string; excerpt: string; category: string; content: string; date: string; published: boolean; cover: string | null };

export function ArticleForm({ article }: { article?: Article }) {
  const [state, action, pending] = useActionState(saveArticle, null);
  const field = "mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3";
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[1.5rem] bg-white p-6">
      {article?.id ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="currentCover" value={article?.cover || ""} />
      <label>Title<input name="title" required defaultValue={article?.title} className={field} /></label>
      <label>Excerpt<textarea name="excerpt" required defaultValue={article?.excerpt} className={field} /></label>
      <label>Category<input name="category" required defaultValue={article?.category} className={field} /></label>
      <label>Date<input type="date" name="date" required defaultValue={article?.date} className={field} /></label>
      <label>Content<textarea name="content" required rows={12} defaultValue={article?.content} className={field} /></label>
      <label>Cover image<input type="file" name="cover" accept="image/jpeg,image/png,image/webp" /></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={article?.published} /> Published</label>
      {state?.error ? <p className="font-semibold">{state.error}</p> : null}
      <button disabled={pending} className="rounded-full bg-navy px-6 py-3 font-semibold text-white">Save article</button>
    </form>
  );
}
