"use client";

import { useActionState, useEffect, useState } from "react";
import { saveArticle } from "@/lib/admin-actions";

type Article = {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  date: string;
  published: boolean;
  cover: string | null;
};

const field =
  "mt-2 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white";

const COVER_INPUT_ID = "article-cover-upload";

function CoverImageSection({ existing }: { existing?: string | null }) {
  const [preview, setPreview] = useState<string | null>(existing || null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileNode, setFileNode] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (file && preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [file, preview]);

  useEffect(() => {
    if (!fileNode) return;
    const transfer = new DataTransfer();
    if (file) transfer.items.add(file);
    fileNode.files = transfer.files;
  }, [file, fileNode]);

  function applyFile(next: File | null) {
    if (file && preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (!next) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) return;
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  function onPick(list: FileList | null) {
    const next = list?.[0] ?? null;
    applyFile(next);
  }

  const hasCover = Boolean(preview);

  return (
    <section className="rounded-[1.8rem] border border-navy/8 bg-[#f7fbfd] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Cover image</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Article photo</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-navy/65">
            Add one JPEG, PNG, or WebP image. It appears on the articles list and at the top of the article page.
          </p>
        </div>
        <span className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-semibold text-navy/70">
          {hasCover ? "1 selected" : "Optional"}
        </span>
      </div>

      <input type="hidden" name="currentCover" value={file ? "" : preview || ""} />
      <input
        ref={setFileNode}
        name="cover"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {hasCover ? (
        <div className="relative mt-6 overflow-hidden rounded-[1.4rem] border border-[#c4a35a]/40 bg-white shadow-[0_12px_30px_rgba(3,4,94,0.06)]">
          <img src={preview!} alt="" className="aspect-[16/10] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-navy/80 px-3 py-2.5 text-white backdrop-blur">
            <span className="text-xs font-semibold">{file ? "New cover ready to save" : "Current cover"}</span>
            <div className="flex gap-2">
              <label
                htmlFor={COVER_INPUT_ID}
                className="cursor-pointer rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={() => applyFile(null)}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <label
        htmlFor={COVER_INPUT_ID}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onPick(event.dataTransfer.files);
        }}
        className={`${hasCover ? "mt-4" : "mt-6"} flex cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-[#c4a35a] bg-[#c4a35a]/10"
            : "border-navy/20 bg-white hover:border-[#c4a35a]/50 hover:bg-[#c4a35a]/5"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-navy text-aqua">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
        <p className="mt-4 font-heading text-xl font-semibold tracking-tight">
          {hasCover ? "Drop a new cover to replace" : "Drop cover image here"}
        </p>
        <p className="mt-2 text-sm text-navy/60">or click to browse JPEG, PNG, or WebP</p>
        <span className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">
          {hasCover ? "Choose another image" : "Choose cover image"}
        </span>
        <input
          id={COVER_INPUT_ID}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            onPick(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
    </section>
  );
}

export function ArticleForm({ article }: { article?: Article }) {
  const [state, action, pending] = useActionState(saveArticle, null);

  return (
    <form action={action} className="grid max-w-3xl gap-5">
      {article?.id ? <input type="hidden" name="id" value={article.id} /> : null}

      <CoverImageSection existing={article?.cover} />

      <section className="rounded-[1.8rem] border border-navy/8 bg-white p-5 shadow-[0_16px_40px_rgba(3,4,94,0.04)] md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Details</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Article information</h2>

        <div className="mt-5 grid gap-4">
          <label className="block font-semibold">
            Title
            <input name="title" required defaultValue={article?.title} className={field} />
          </label>
          <label className="block font-semibold">
            Excerpt
            <textarea name="excerpt" required rows={3} defaultValue={article?.excerpt} className={field} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block font-semibold">
              Category
              <input name="category" required defaultValue={article?.category} className={field} />
            </label>
            <label className="block font-semibold">
              Date
              <input type="date" name="date" required defaultValue={article?.date} className={field} />
            </label>
          </div>
          <label className="block font-semibold">
            Content
            <textarea name="content" required rows={12} defaultValue={article?.content} className={field} />
          </label>
          <label className="flex items-center gap-3 font-semibold">
            <input
              type="checkbox"
              name="published"
              defaultChecked={article?.published}
              className="h-4 w-4 rounded border-navy/30"
            />
            Published
          </label>
        </div>
      </section>

      {state?.error ? <p className="font-semibold text-red-700">{state.error}</p> : null}

      <button
        disabled={pending}
        className="rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save article"}
      </button>
    </form>
  );
}
