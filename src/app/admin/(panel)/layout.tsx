import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f7fbfd] lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar adminName={admin.name} />
      <main id="content" className="px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
