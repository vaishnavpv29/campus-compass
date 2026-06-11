"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bookmark, CalendarDays, Star, Sparkles, MapPin, Clock,
  ChevronRight, Loader2, ArrowRight, TrendingUp
} from "lucide-react";
import { cn, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      const [profileRes, meetingsRes] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/meetings"),
      ]);
      const profileData = await profileRes.json();
      const meetingsData = await meetingsRes.json();
      setProfile(profileData);
      setMeetings(meetingsData.meetings || []);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const upcomingMeetings = meetings.filter((m) => m.status === "accepted" && new Date(m.date) > new Date());
  const pendingMeetings = meetings.filter((m) => m.status === "pending");
  const wishlist = profile?.wishlist || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              ) : getInitials(session?.user?.name || "S")}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-sm">Student Dashboard · Your college journey, all in one place</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Saved Colleges", value: wishlist.length, icon: Bookmark, color: "text-primary", href: "#wishlist" },
            { label: "Upcoming Sessions", value: upcomingMeetings.length, icon: CalendarDays, color: "text-green-500", href: "#meetings" },
            { label: "Pending Requests", value: pendingMeetings.length, icon: Clock, color: "text-amber-500", href: "#meetings" },
            { label: "Quiz Taken", value: profile?.quizHistory ? "Yes" : "Try it!", icon: Sparkles, color: "text-purple-500", href: "/quiz" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="card-hover p-5 text-center block">
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <div className="font-heading font-bold text-2xl text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Meetings */}
            <div id="meetings" className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg">My Sessions</h2>
                <Link href="/meetings" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Find Insiders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 dark:bg-slate-800/30 rounded-xl">
                  <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No sessions yet.</p>
                  <Link href="/meetings" className="btn-primary text-sm mt-3 inline-flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> Book a Session
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.slice(0, 5).map((meeting) => (
                    <div key={meeting._id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 dark:bg-slate-800/40 hover:bg-muted/60 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
                        {meeting.insider?.image ? <img src={meeting.insider.image} alt="" className="w-10 h-10 object-cover" /> : getInitials(meeting.insider?.name || "I")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{meeting.insider?.name}</p>
                        <p className="text-xs text-muted-foreground">{meeting.college?.name} • {meeting.duration} min</p>
                        <p className="text-xs text-muted-foreground">{formatDate(meeting.date)} at {meeting.timeSlot}</p>
                      </div>
                      <span className={cn(
                        "badge text-[10px] flex-shrink-0",
                        meeting.status === "accepted" ? "badge-green" :
                        meeting.status === "pending" ? "badge-amber" :
                        meeting.status === "declined" ? "badge-red" : "bg-muted text-muted-foreground"
                      )}>
                        {meeting.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div id="wishlist" className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  Saved Colleges
                </h2>
                <Link href="/colleges" className="text-sm text-primary hover:underline">Browse more</Link>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 dark:bg-slate-800/30 rounded-xl">
                  <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No colleges saved yet.</p>
                  <Link href="/colleges" className="btn-outline text-sm mt-3 inline-block">Browse Colleges</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((college: any) => (
                    <Link key={college._id} href={`/colleges/${college.slug}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                        {college.logo ? <img src={college.logo} alt="" className="w-10 h-10 object-contain p-1" /> : college.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{college.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {college.location?.city}, {college.location?.state}
                          {college.nirfRanking && <span>• NIRF #{college.nirfRanking}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold">{college.avgRating > 0 ? college.avgRating.toFixed(1) : "N/A"}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="card p-5">
              <h3 className="font-heading font-bold text-base mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Take College Match Quiz", href: "/quiz", icon: Sparkles, color: "text-purple-500" },
                  { label: "Compare Colleges", href: "/compare", icon: TrendingUp, color: "text-blue-500" },
                  { label: "Browse Insiders", href: "/meetings", icon: CalendarDays, color: "text-green-500" },
                  { label: "Read Reviews", href: "/colleges", icon: Star, color: "text-amber-500" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <action.icon className={cn("w-4 h-4", action.color)} />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile completion hint */}
            <div className="card p-5 bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-slate-800/50 border-primary/20">
              <h3 className="font-heading font-bold text-sm text-foreground mb-2">Complete Your Profile</h3>
              <p className="text-xs text-muted-foreground mb-3">A complete profile helps insiders tailor their advice for you.</p>
              <Link href="/profile" className="btn-outline text-xs py-2 block text-center">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
