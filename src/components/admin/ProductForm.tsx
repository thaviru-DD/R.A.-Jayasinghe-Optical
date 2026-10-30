"use client";

import { useActionState } from "react";
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

const field = "mt-1 w-full rounded-2xl border border-navy/15 px-4 py-3";

export function ProductForm({ product }: { product?: Values }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[1.6rem] bg-white p-6">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <label>Name<input name="name" required defaultValue={product?.name} className={field} /></label>
      <label>Brand<input name="brand" required defaultValue={product?.brand} className={field} /></label>
      <label>Description<textarea name="description" required rows={4} defaultValue={product?.description} className={field} /></label>
      <label>Price in rupees<input name="price" type="number" min={1} required defaultValue={product?.price} className={field} /></label>
      <label>Category
        <select name="category" defaultValue={product?.category || "spectacles"} className={field}>
          <option value="spectacles">Spectacles</option>
          <option value="sunglasses">Sunglasses</option>
          <option value="contact-lenses">Contact lenses</option>
          <option value="lenses">Lenses</option>
        </select>
      </label>
      <label>Who it is for
        <select name="audience" defaultValue={product?.audience || ""} className={field}>
          <option value="">Not applicable</option>
          {audiences.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
        </select>
      </label>
      <label>Frame type
        <select name="frameType" defaultValue={product?.frameType || ""} className={field}>
          <option value="">Not applicable</option>
          {frameTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>Shape
        <select name="shape" defaultValue={product?.shape || ""} className={field}>
          <option value="">Not applicable</option>
          {shapes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>Discount
        <select name="discountType" defaultValue={product?.discountType || ""} className={field}>
          <option value="">None</option>
          <option value="percent">Percentage</option>
          <option value="price">New price</option>
        </select>
      </label>
      <label>Discount value<input name="discountValue" type="number" min={0} defaultValue={product?.discountValue ?? ""} className={field} /></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="showDiscount" defaultChecked={product?.showDiscount} /> Show the discount to customers</label>
      <label className="flex items-center gap-2"><input type="checkbox" name="inStock" defaultChecked={product?.inStock ?? true} /> In stock</label>
      <label className="flex items-center gap-2"><input type="checkbox" name="hidden" defaultChecked={product?.hidden} /> Hide from the website</label>
      {product?.images.length ? (
        <fieldset>
          <legend className="font-semibold">Keep these images</legend>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {product.images.map((src) => (
              <label key={src} className="text-sm">
                <img src={src} alt="" className="aspect-square w-full rounded-xl object-cover" />
                <span className="mt-1 flex items-center gap-2"><input type="checkbox" name="keep" value={src} defaultChecked /> Keep</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <label>Images
        <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-1 block w-full" />
      </label>
      <p>Spectacles, sunglasses, and contact lenses need 3 or 4 images. Lenses need at least one.</p>
      {state?.error ? <p className="font-semibold" role="alert">{state.error}</p> : null}
      <button disabled={pending} className="rounded-full bg-navy px-6 py-3 font-semibold text-white">{pending ? "Saving…" : "Save product"}</button>
    </form>
  );
}
