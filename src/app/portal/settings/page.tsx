import type { Metadata } from "next";
import { Bell, Building2, Lock, UserCircle } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Button } from "@/components/portal-ui/button";
import { Switch } from "@/components/portal-ui/switch";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { currentUser } from "@/data/portal";

export const metadata: Metadata = {
  title: "Settings | TechParivar Client Portal",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Manage your profile, company details, and notification preferences.
        </p>
      </div>

      <Card className="gap-5 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <UserCircle className="size-4 text-primary" /> Profile
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">{currentUser.avatarInitials}</AvatarFallback>
          </Avatar>
          <Button variant="secondary" size="sm">
            Change Photo
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={currentUser.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue={currentUser.role} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={currentUser.email} />
          </div>
        </div>
        <div>
          <Button size="sm">Save Changes</Button>
        </div>
      </Card>

      <Card className="gap-5 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="size-4 text-primary" /> Company
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input id="company" defaultValue={currentUser.company} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store">Active Store</Label>
          <Input id="store" defaultValue={currentUser.activeStore} />
        </div>
      </Card>

      <Card className="gap-5 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="size-4 text-primary" /> Notification Preferences
        </div>
        {[
          { label: "Ticket updates", description: "New comments and status changes on your tickets" },
          { label: "Project milestones", description: "When a milestone is completed or a phase begins" },
          { label: "Invoice reminders", description: "Payment due dates and receipts" },
          { label: "Meeting reminders", description: "45 minutes before a scheduled call" },
        ].map((pref, index) => (
          <div
            key={pref.label}
            className={`flex items-center justify-between ${
              index !== 0 ? "border-t border-border/60 pt-4" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium">{pref.label}</p>
              <p className="text-xs text-on-surface-variant">{pref.description}</p>
            </div>
            <Switch defaultChecked={index < 3} />
          </div>
        ))}
      </Card>

      <Card className="gap-5 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4 text-primary" /> Security
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" placeholder="••••••••" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div>
          <Button size="sm" variant="secondary">
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
