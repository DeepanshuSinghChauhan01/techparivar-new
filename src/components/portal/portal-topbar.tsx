"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, Plus, Search, Settings, UserCircle } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/portal-ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/portal-ui/dropdown-menu";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/portal";

const topNav = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Projects", href: "/portal/projects" },
  { label: "Support", href: "/portal/support" },
  { label: "Meetings", href: "/portal/meetings" },
  { label: "Knowledge Base", href: "/portal/knowledge-base" },
];

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join("") || "U"
  );
}

export function PortalTopbar({
  name,
  email,
  company,
}: {
  name: string;
  email: string;
  company?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-surface/90 px-4 backdrop-blur-xl md:gap-6 md:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <PortalSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative hidden w-full max-w-sm sm:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
        <Input
          placeholder="Search projects, tickets, or files..."
          className="h-10 border-border/80 bg-surface-container-low pl-10"
        />
      </div>

      <nav className="hidden items-center gap-5 xl:flex">
        {topNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground",
              pathname.startsWith(item.href) && "font-semibold text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <Button size="sm" className="hidden sm:inline-flex" asChild>
          <Link href="/portal/support">
            <Plus className="size-4" />
            New Ticket
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/portal/notifications">
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            )}
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
              <Avatar>
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {name}
              <p className="mt-0.5 text-xs font-normal text-on-surface-variant">
                {company ? `${company} • ${email}` : email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/portal/settings">
                <UserCircle className="size-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/portal/settings">
                <Settings className="size-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="size-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
