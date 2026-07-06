import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { PortalTopbar } from "@/components/portal/portal-topbar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const clientProfile =
    user.role === "CLIENT"
      ? await prisma.clientProfile.findUnique({
          where: { userId: user.id },
          select: { companyName: true },
        })
      : null;

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-border/60 bg-surface/95 backdrop-blur-xl lg:block">
        <PortalSidebar />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <PortalTopbar
          name={user.name ?? "User"}
          email={user.email ?? ""}
          company={clientProfile?.companyName}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}