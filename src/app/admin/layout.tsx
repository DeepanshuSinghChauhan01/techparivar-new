import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { requireAdmin } from "@/lib/auth-helpers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-border/60 bg-surface/95 backdrop-blur-xl lg:block">
        <AdminSidebar />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <AdminTopbar name={admin.name ?? admin.email ?? "Admin"} email={admin.email ?? ""} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
