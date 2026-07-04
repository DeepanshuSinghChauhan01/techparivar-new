import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { Badge } from "@/components/portal-ui/badge";
import { teamMembers } from "@/data/portal";

export const metadata: Metadata = {
  title: "Team | TechParivar Client Portal",
};

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Your Team</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          The engineers and strategists assigned to your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="size-12">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                    member.online ? "bg-mint-green" : "bg-on-surface-variant"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-on-surface-variant">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <Badge variant={member.online ? "success" : "secondary"}>
                {member.online ? "Online" : "Offline"}
              </Badge>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Mail className="size-3.5" /> Message
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
