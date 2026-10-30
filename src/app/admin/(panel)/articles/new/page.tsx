import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth";

export default async function Page() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 font-heading text-4xl font-semibold">New article</h1>
      <ArticleForm />
    </div>
  );
}
