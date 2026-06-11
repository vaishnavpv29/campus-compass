"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Star, CalendarDays, Users, Filter, CheckCircle, MapPin, Loader2, ArrowRight } from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";

interface Insider {
  _id: string;
  name: string;
  image?: string;
  bio?: string;
  course?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  expertise?: string[];
  rating: number;
  sessionCount: number;
  isVerified: boolean;
  availabilitySlots: any[];
  college?: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    location: { city: string; state: string };
  };
}

export default function MeetingsPage() {
  const [insiders, setInsiders] = useState<Insider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");

  useEffect(() => {
    fetchInsiders();
  }, []);

  const fetchInsiders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/insiders?limit=24");
      const data = await res.json();
      setInsiders(data.insiders || []);
    } catch {
      toast.error("Failed to load insiders");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = insiders.filter((i) => {
    const matchesSearch = !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.college?.name.toLowerCase().includes(search.toLowerCase()) ||
      i.course?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-hero-gradient py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="badge bg-white/20 text-white mb-4 text-sm px-4 py-1.5">
            <CalendarDays className="w-4 h-4 mr-1.5 inline" />
            1-on-1 Sessions with Real Students
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Meet College Insiders
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Get honest, first-hand insights from current students and alumni of your target colleges.
            Book a free 1-on-1 session today.
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, college, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="insiders-search"
              className="input-field pl-12 py-4 text-base shadow-xl"
            />
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20Q1320 0 1200 10Q1080 20 960 10Q840 0 720 10Q600 20 480 10Q360 0 240 10Q120 20 0 10L0 40Z" fill="rgb(248 250 252)" className="dark:fill-slate-950" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground text-lg">{filtered.length} Insiders</span>
          <span>•</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> All Verified</span>
          <span>•</span>
          <span>Free for students</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card h-56 skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">No insiders found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((insider) => (
              <InsiderCard key={insider._id} insider={insider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsiderCard({ insider }: { insider: Insider }) {
  const availableSlots = insider.availabilitySlots?.filter((s) => !s.isBooked).length || 0;

  return (
    <div className="card-hover p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
          {insider.image ? (
            <img src={insider.image} alt={insider.name} className="w-14 h-14 object-cover" />
          ) : getInitials(insider.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading font-bold text-foreground text-sm">{insider.name}</h3>
            {insider.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            )}
          </div>
          {insider.college && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{insider.college.name}</span>
            </div>
          )}
          {insider.course && (
            <div className="text-xs text-primary mt-0.5 font-medium">{insider.course}</div>
          )}
        </div>
      </div>

      {/* Bio */}
      {insider.bio && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{insider.bio}</p>
      )}

      {/* Expertise tags */}
      {insider.expertise && insider.expertise.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {insider.expertise.slice(0, 3).map((tag, i) => (
            <span key={i} className="badge bg-muted dark:bg-slate-700 text-muted-foreground text-[10px]">{tag}</span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 mt-auto">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold">{insider.rating > 0 ? insider.rating.toFixed(1) : "New"}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {insider.sessionCount} session{insider.sessionCount !== 1 ? "s" : ""}
        </div>
        <div className={cn("ml-auto text-xs font-medium", availableSlots > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
          {availableSlots > 0 ? `${availableSlots} slots open` : "No slots"}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/meetings/${insider._id}`}
        className={cn(
          "btn-primary text-sm py-2.5 text-center flex items-center justify-center gap-1.5",
          availableSlots === 0 && "opacity-60 pointer-events-none"
        )}
      >
        <CalendarDays className="w-4 h-4" />
        {availableSlots > 0 ? "Book Session" : "Not Available"}
      </Link>
    </div>
  );
}
