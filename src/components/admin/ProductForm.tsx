"use client";

import { useActionState, useEffect, useId, useMemo, useState } from "react";
import { saveProduct } from "@/lib/admin-actions";
import { audiences, frameTypes, shapes } from "@/lib/site";

type Values = {
  id?: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  audience: string | null;
  frameType: string | null;
  shape: string | null;
  discountType: string | null;
  discountValue: number | null;
  showDiscount: boolean;
  inStock: boolean;
  hidden: boolean;
  images: string[];
};

type Preview = { id: string; file: File; url: string };

const field =
  "mt-2 w-full rounded-2xl border border-navy/12 bg-[#f7fbfd] px-4 py-3.5 outline-none transition focus:border-[#c4a35a]/50 focus:bg-white";

function ImageUploadSection({ existing = [] }: { existing?: string[] }) {
  const inputId = useId();
  const [keep, setKeep] = useState<Record<string, boolean>>(
    () => Object.fromEntries(existing.map((src) => [src, true])),
  );
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const keptCount = useMemo(() => Object.values(keep).filter(Boolean).length, [keep]);
  const totalCount = keptCount + previews.length;

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next = Array.from(fileList)
      .filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type))
      .slice(0, Math.max(0, 4 - totalCount))
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));
    if (!next.length) return;
    setPreviews((current) => [...current, ...next].slice(0, 4));
  }

  function removePreview(id: string) {
    setPreviews((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  }

  return (
    <section className="rounded-[1.8rem] border border-navy/8 bg-[#f7fbfd] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Product images</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Add photos</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-navy/65">
            Spectacles, sunglasses, and contact lenses need 3 or 4 images. Lenses need at least 1. JPG, PNG, or WebP.
          </p>
        </div>
        <span className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-semibold text-navy/70">
          {totalCount}/4 selected
        </span>
      </div>

      {existing.length ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-navy">Current images</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {existing.map((src) => (
              <label
                key={src}
                className={`group relative overflow-hidden rounded-[1.3rem] border bg-white transition ${
                  keep[src] ? "border-[#c4a35a]/40 shadow-[0_12px_30px_rgba(3,4,94,0.06)]" : "border-navy/10 opacity-55"
                }`}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-navy/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                  <input
                    type="checkbox"
                    name="keep"
                    value={src}
                    checked={Boolean(keep[src])}
                    onChange={(event) => setKeep((current) => ({ ...current, [src]: event.target.checked }))}
                    className="rounded border-white/30"
                  />
                  Keep
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {previews.length ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-navy">New uploads</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-[1.3rem] border border-aqua/40 bg-white shadow-[0_12px_30px_rgba(3,4,94,0.06)]">
                <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(item.id)}
                  className="absolute right-2 top-2 rounded-full bg-navy/85 px-2.5 py-1 text-xs font-semibold text-white"
                >
                  Remove
                </button>
                <p className="truncate px-3 py-2 text-xs text-navy/60">{item.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <label
        htmlFor={inputId}
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
          addFiles(event.dataTransfer.files);
        }}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 py-10 text-center transition ${
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
        <p className="mt-4 font-heading text-xl font-semibold tracking-tight">Drop images here</p>
        <p className="mt-2 text-sm text-navy/60">or click to browse files from your computer</p>
        <span className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">Choose images</span>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      <SyncedFilesInput files={previews.map((item) => item.file)} />
    </section>
  );
}

function SyncedFilesInput({ files }: { files: File[] }) {
  const [node, setNode] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    node.files = transfer.files;
  }, [files, node]);

  return <input ref={setNode} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" />;
}

export function ProductForm({ product }: { product?: Values }) {
  const [state, action, pending] = useActionState(saveProduct, null);

  return (
    <form action={action} className="grid max-w-4xl gap-5">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}

      <section className="rounded-[1.8rem] border border-navy/8 bg-white p-5 shadow-[0_16px_40px_rgba(3,4,94,0.04)] md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Details</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Product information</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            Name
            <input name="name" required defaultValue={product?.name} className={field} />
          </label>
          <label className="block">
            Brand
            <input name="brand" required defaultValue={product?.brand} className={field} />
          </label>
          <label className="block">
            Price in rupees
            <input name="price" type="number" min={1} required defaultValue={product?.price} className={field} />
          </label>
          <label className="block md:col-span-2">
            Description
            <textarea name="description" required rows={4} defaultValue={product?.description} className={field} />
          </label>
          <label className="block">
            Category
            <select name="category" defaultValue={product?.category || "spectacles"} className={field}>
              <option value="spectacles">Spectacles</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-lenses">Contact lenses</option>
              <option value="lenses">Lenses</option>
            </select>
          </label>
          <label className="block">
            Who it is for
            <select name="audience" defaultValue={product?.audience || ""} className={field}>
              <option value="">Not applicable</option>
              {audiences.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Frame type
            <select name="frameType" defaultValue={product?.frameType || ""} className={field}>
              <option value="">Not applicable</option>
              {frameTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Shape
            <select name="shape" defaultValue={product?.shape || ""} className={field}>
              <option value="">Not applicable</option>
              {shapes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-navy/8 bg-white p-5 shadow-[0_16px_40px_rgba(3,4,94,0.04)] md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a35a]">Pricing</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">Discount & stock</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            Discount
            <select name="discountType" defaultValue={product?.discountType || ""} className={field}>
              <option value="">None</option>
              <option value="percent">Percentage</option>
              <option value="price">New price</option>
            </select>
          </label>
          <label className="block">
            Discount value
            <input name="discountValue" type="number" min={0} defaultValue={product?.discountValue ?? ""} className={field} />
          </label>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-[#f7fbfd] px-4 py-3">
            <input type="checkbox" name="showDiscount" defaultChecked={product?.showDiscount} />
            <span className="text-sm font-medium">Show the discount to customers</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-[#f7fbfd] px-4 py-3">
            <input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} />
            <span className="text-sm font-medium">In stock</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-[#f7fbfd] px-4 py-3">
            <input type="checkbox" name="hidden" defaultChecked={product?.hidden} />
            <span className="text-sm font-medium">Hide from the website</span>
          </label>
        </div>
      </section>

      <ImageUploadSection existing={product?.images ?? []} />

      {state?.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-navy" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        disabled={pending}
        className="rounded-full bg-navy px-7 py-3.5 font-semibold text-white transition hover:bg-aqua hover:text-navy disabled:opacity-60 md:w-fit"
      >
        {pending ? "Saving…" : product ? "Update product" : "Save product"}
      </button>
    </form>
  );
}
