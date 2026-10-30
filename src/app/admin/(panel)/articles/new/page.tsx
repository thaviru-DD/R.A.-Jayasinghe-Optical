import { ArticleForm } from "@/components/admin/ArticleForm";

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-4xl font-semibold">New article</h1>
      <ArticleForm />
    </div>
  );
}
