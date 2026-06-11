"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays, Star, Eye, ThumbsUp, CheckCircle, Clock, X,
  Loader2, MessageSquare, TrendingUp, Users, ChevronRight, Link2
} from "lucide-react";
import { cn, formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";

export default function InsiderDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meetLink, setMeetLink] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/meetings?role=insider");
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeetingAction = async (meetingId: string, action: "accept" | "decline", link?: string) => {
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, meetLink: link }),
      });
      if (res.ok) {
        toast.success(action === "accept" ? "Meeting accepted! 🎉" : "Meeting declined");
        setMeetings((prev) => prev.map((m) => m._id === meetingId ? { ...m, status: action === "accept" ? "accepted" : "declined" } : m));
      }
    } catch {
      toast.error("Action failed");
    }
  };

  if (isLoading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const pending = meetings.filter((m) => m.status === "pending");
  const accepted = meetings.filter((m) => m.status === "accepted");
  const completed = meetings.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              ) : getInitials(session?.user?.name || "I")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {session?.user?.name?.split(" ")[0]}&apos;s Dashboard
                </h1>
                <span className="verified-badge">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Insider
                </span>
              </div>
              <p className="text-muted-foreground text-sm">College Insider · Share your experience, help students decide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Requests", value: pending.length, icon: Clock, color: "text-amber-500" },
            { label: "Confirmed Sessions", value: accepted.length, icon: CalendarDays, color: "text-green-500" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-primary" },
            { label: "Total Sessions", value: meetings.length, icon: Users, color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <div className="font-heading font-bold text-2xl text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pending Requests — need attention */}
        {pending.length > 0 && (
          <div className="card p-6 mb-6 border-2 border-amber/30">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber" />
              Pending Requests ({pending.length})
              <span className="badge bg-amber text-white text-xs animate-pulse-soft">Needs Action</span>
            </h2>
            <div className="space-y-4">
              {pending.map((meeting) => (
                <div key={meeting._id} className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {getInitials(meeting.student?.name || "S")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{meeting.student?.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(meeting.date)} · {meeting.timeSlot} · {meeting.duration} min</p>
                          <p className="text-xs text-muted-foreground">Type: {meeting.type === "1on1" ? "1-on-1 Chat" : "Group Q&A"}</p>
                        </div>
                      </div>
                      {meeting.message && (
                        <div className="mt-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg text-xs text-muted-foreground italic border border-border">
                          "{meeting.message}"
                        </div>
                      )}
                      {/* Meet Link Input */}
                      <div className="mt-3 flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="url"
                            placeholder="Paste Google Meet / Zoom link (optional)"
                            value={meetLink[meeting._id] || ""}
                            onChange={(e) => setMeetLink((prev) => ({ ...prev, [meeting._id]: e.target.value }))}
                            className="input-field text-xs py-2 pl-8"
                          />
                        </div>
                        <button
                          onClick={() => handleMeetingAction(meeting._id, "accept", meetLink[meeting._id])}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleMeetingAction(meeting._id, "decline")}
                          className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming & Past Meetings */}
        <div className="card p-6">
          <h2 className="font-heading font-bold text-lg mb-4">All Meetings</h2>
          {meetings.filter((m) => m.status !== "pending").length === 0 ? (
            <div className="text-center py-10 bg-muted/30 rounded-xl">
              <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No confirmed meetings yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Make sure your profile is complete so students can find you!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.filter((m) => m.status !== "pending").map((meeting) => (
                <div key={meeting._id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 dark:bg-slate-800/40">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(meeting.student?.name || "S")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{meeting.student?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(meeting.date)} · {meeting.timeSlot} · {meeting.duration} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.meetLink && meeting.status === "accepted" && (
                      <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Join
                      </a>
                    )}
                    <span className={cn(
                      "badge text-[10px]",
                      meeting.status === "accepted" ? "badge-green" :
                      meeting.status === "completed" ? "badge-primary" :
                      "badge-red"
                    )}>
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
