"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users, GraduationCap, Star, Flag, CalendarDays, TrendingUp,
  ShieldCheck, Loader2, CheckCircle, XCircle, Eye, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { cn, formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingColleges, setPendingColleges] = useState<any[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/"); return;
    }
    if (status === "authenticated") fetchData();
  }, [status, session]);

  const fetchData = async () => {
    try {
      const [analyticsRes, collegesRes, reviewsRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/colleges?isApproved=false&limit=10"),
        fetch("/api/reviews?isFlagged=true&limit=10"),
      ]);
      const [analyticsData, collegesData, reviewsData] = await Promise.all([
        analyticsRes.json(),
        collegesRes.json(),
        reviewsRes.json(),
      ]);
      setAnalytics(analyticsData);
      setPendingColleges(collegesData.colleges || []);
      setFlaggedReviews(reviewsData.reviews || []);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const approveCollege = async (id: string) => {
    try {
      await fetch(`/api/colleges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      toast.success("College approved!");
      setPendingColleges((prev) => prev.filter((c) => c._id !== id));
      if (analytics) {
        setAnalytics((a: any) => ({
          ...a,
          stats: { ...a.stats, pendingColleges: a.stats.pendingColleges - 1 },
        }));
      }
    } catch {
      toast.error("Failed to approve");
    }
  };

  const moderateReview = async (id: string, action: "approve" | "reject") => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      toast.success(`Review ${action}d`);
      setFlaggedReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to moderate");
    }
  };

  if (isLoading || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const stats = analytics?.stats || {};
  const charts = analytics?.charts || {};

  const statCards = [
    { label: "Total Colleges", value: stats.totalColleges || 0, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Users", value: stats.totalUsers || 0, icon: Users, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Total Reviews", value: stats.totalReviews || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Total Meetings", value: stats.totalMeetings || 0, icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Pending Colleges", value: stats.pendingColleges || 0, icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Flagged Reviews", value: stats.flaggedReviews || 0, icon: Flag, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
    { label: "Students", value: stats.totalStudents || 0, icon: Users, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
    { label: "Insiders", value: stats.totalInsiders || 0, icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Platform overview and management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className={cn("card p-5", stat.bg)}>
              <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
              <div className="font-heading font-bold text-2xl text-foreground">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signups Chart */}
          {charts.recentSignups && charts.recentSignups.length > 0 && (
            <div className="card p-6">
              <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                New Signups (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={charts.recentSignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#1E3A8A" strokeWidth={2} dot={{ fill: "#1E3A8A" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Colleges */}
          {charts.topColleges && charts.topColleges.length > 0 && (
            <div className="card p-6">
              <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber" />
                Top Colleges by Views
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.topColleges} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="viewCount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Moderation Queues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Colleges */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Pending College Approvals
              {stats.pendingColleges > 0 && (
                <span className="badge bg-red-500 text-white text-xs">{stats.pendingColleges}</span>
              )}
            </h2>
            {pendingColleges.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All colleges reviewed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingColleges.map((college) => (
                  <div key={college._id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-slate-800/50">
                    <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {college.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{college.name}</p>
                      <p className="text-xs text-muted-foreground">{college.location?.city}, {college.location?.state} · {college.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveCollege(college._id)}
                        className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flagged Reviews */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              Flagged Reviews
              {stats.flaggedReviews > 0 && (
                <span className="badge bg-red-500 text-white text-xs">{stats.flaggedReviews}</span>
              )}
            </h2>
            {flaggedReviews.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No flagged reviews!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedReviews.map((review) => (
                  <div key={review._id} className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-800/30">
                    <p className="text-xs text-muted-foreground mb-1">by {review.author?.name} · {formatDate(review.createdAt)}</p>
                    <p className="text-sm text-foreground line-clamp-2">{review.pros}</p>
                    {review.flagReason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {review.flagReason}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => moderateReview(review._id, "approve")}
                        className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Keep
                      </button>
                      <button
                        onClick={() => moderateReview(review._id, "reject")}
                        className="flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Insiders */}
        {charts.topInsiders && charts.topInsiders.length > 0 && (
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber" />
              Top Insiders by Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {charts.topInsiders.map((insider: any, i: number) => (
                <div key={insider._id} className="card p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold mx-auto mb-2 overflow-hidden">
                    {insider.image ? <img src={insider.image} alt="" className="w-10 h-10 object-cover" /> : insider.name?.charAt(0)}
                  </div>
                  <p className="font-semibold text-xs text-foreground truncate">{insider.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{insider.college?.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{insider.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{insider.sessionCount} sessions</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
