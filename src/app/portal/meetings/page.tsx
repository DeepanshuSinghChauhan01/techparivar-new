import type { Metadata } from "next";
import { CalendarClock, Plus, Video } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Button } from "@/components/portal-ui/button";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { meetings } from "@/data/portal";

export const metadata: Metadata = {
  title: "Meetings | TechParivar Client Portal",
};

export default function MeetingsPage() {
  const upcoming = meetings.filter((m) => m.status === "upcoming");
  const past = meetings.filter((m) => m.status === "past");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Meetings</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Book time with your engineering team or join an upcoming call.
          </p>
        </div>
        <Button>
          <Plus className="size-4" /> Book a Meeting
        </Button>
      </div>

      <div>
        <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Upcoming ({upcoming.length})
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {upcoming.map((meeting) => (
            <Card key={meeting.id} className="gap-4 p-5">
              <div className="flex items-start justify-between">
                <Badge variant="info">{meeting.type}</Badge>
                <span className="flex items-center gap-1.5 font-portal-data text-xs text-on-surface-variant">
                  <CalendarClock className="size-3.5" />
                  {meeting.date}
                </span>
              </div>
              <div>
                <p className="font-portal-display text-lg font-semibold">{meeting.title}</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {meeting.time} · {meeting.duration}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {meeting.attendees.map((attendee) => (
                    <Avatar key={attendee.name} className="size-7 border-2 border-card">
                      <AvatarFallback className="text-[10px]">{attendee.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button size="sm" variant="secondary">
                  <Video className="size-3.5" /> Join Call
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Past Meetings
        </p>
        <Card className="mt-4 gap-0 p-0">
          {past.map((meeting, index) => (
            <div
              key={meeting.id}
              className={`flex items-center justify-between px-5 py-4 ${
                index !== past.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{meeting.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {meeting.date} · {meeting.time}
                </p>
              </div>
              <Badge variant="secondary">{meeting.type}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
