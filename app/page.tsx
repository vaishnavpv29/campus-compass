"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  GraduationCap,
  Star,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  GitCompare,
  CalendarDays,
  Shield,
  TrendingUp,
  MapPin,
  ChevronRight,
  CheckCircle,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Colleges Listed", value: "2,500+", icon: GraduationCap, color: "text-blue-500" },
  { label: "Student Reviews", value: "18,000+", icon: Star, color: "text-amber-500" },
  { label: "Students Helped", value: "1.2L+", icon: Users, color: "text-green-500" },
  { label: "Insider Sessions", value: "8,500+", icon: CalendarDays, color: "text-purple-500" },
];

const features = [
  {
    icon: BookOpen,
    title: "Rich College Profiles",
    description: "Deep-dive into colleges with placement data, campus life, courses, fees, and verified student reviews.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: GitCompare,
    title: "Side-by-Side Comparison",
    description: "Compare up to 3 colleges across 20+ parameters including rankings, fees, placements, and ratings.",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Sparkles,
    title: "College Match Quiz",
    description: "Answer 8 smart questions and get personalized college recommendations with match percentages.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: CalendarDays,
    title: "Meet Real Insiders",
    description: "Book 1-on-1 sessions with verified current students and alumni from your target colleges.",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50 dark:bg-emerald-950/30",
  },
  {
    icon: Shield,
    title: "Verified Reviews",
    description: "Every review is written by verified students or alumni — no fake reviews, no paid promotions.",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: TrendingUp,
    title: "Placement Analytics",
    description: "Track year-wise placement trends, top recruiters, and salary benchmarks with interactive charts.",
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

const steps = [
  {
    step: "01",
    title: "Take the Quiz",
    description: "Tell us your preferences — location, budget, stream, and career goals.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Explore Matches",
    description: "Get personalised college recommendations with detailed profiles.",
    icon: Search,
  },
  {
    step: "03",
    title: "Talk to Insiders",
    description: "Book sessions with current students to get honest, first-hand insights.",
    icon: Users,
  },
  {
    step: "04",
    title: "Decide with Confidence",
    description: "Compare your shortlist and make the best decision for your future.",
    icon: CheckCircle,
  },
];

const popularColleges = [
  { name: "IIT Bombay", location: "Mumbai, Maharashtra", rank: 1, rating: 4.8, type: "Public", slug: "iit-bombay" },
  { name: "IIM Ahmedabad", location: "Ahmedabad, Gujarat", rank: 1, rating: 4.9, type: "Public", slug: "iim-ahmedabad" },
  { name: "AIIMS Delhi", location: "New Delhi", rank: 1, rating: 4.7, type: "Public", slug: "aiims-delhi" },
  { name: "NIT Trichy", location: "Tiruchirappalli, TN", rank: 9, rating: 4.5, type: "Public", slug: "nit-trichy" },
  { name: "BITS Pilani", location: "Pilani, Rajasthan", rank: 26, rating: 4.6, type: "Private", slug: "bits-pilani" },
  { name: "VIT Vellore", location: "Vellore, Tamil Nadu", rank: 15, rating: 4.3, type: "Private", slug: "vit-vellore" },
];

const testimonials = [
  {
    name: "Arjun Sharma",
    college: "IIT Kharagpur, 2024",
    avatar: "AS",
    text: "Campus Compass helped me compare 8 engineering colleges in one sitting. The insider sessions were the most valuable — I got honest answers to questions colleges would never answer officially.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    college: "NLSIU Bangalore, 2023",
    avatar: "PN",
    text: "The quiz recommended NLSIU with 89% match and it turned out perfect for me! The reviews are brutally honest — no marketing fluff. Exactly what students need.",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    college: "IIM Calcutta, 2025",
    avatar: "RM",
    text: "As a College Insider, I've helped 40+ students navigate their MBA journey. The platform makes it incredibly easy to manage bookings and share my experience.",
    rating: 5,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedStats, setAnimatedStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-hero-gradient hero-pattern overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 hidden xl:block animate-float">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-white">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              NIRF Rank #1
            </div>
          </div>
        </div>
        <div className="absolute top-40 right-16 hidden xl:block animate-float" style={{ animationDelay: "1s" }}>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-white">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              4.8 Rating
            </div>
          </div>
        </div>
        <div className="absolute bottom-40 left-16 hidden xl:block animate-float" style={{ animationDelay: "2s" }}>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-white">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Zap className="w-4 h-4 text-green-400" />
              Session booked!
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            India&apos;s #1 College Discovery Platform
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Find Your{" "}
            <span className="relative">
              <span className="text-amber-400">Perfect College</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 10 Q150 0 300 10" stroke="rgba(245,158,11,0.6)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br />
            With Confidence
          </h1>

          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Compare colleges, read verified reviews from real students, take our AI-powered quiz, 
            and book 1-on-1 sessions with insiders — all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-white/30">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search colleges by name, city, or stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="hero-search"
                className="flex-1 pl-12 pr-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <button
                type="submit"
                className="m-2 btn-primary rounded-xl py-3 px-6 flex items-center gap-2 whitespace-nowrap"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <span className="text-blue-200 text-sm">Popular:</span>
            {["IIT Delhi", "IIM Bangalore", "AIIMS", "NIT Warangal", "BITS Pilani"].map((s) => (
              <button
                key={s}
                onClick={() => router.push(`/colleges?q=${encodeURIComponent(s)}`)}
                className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/quiz" className="btn-secondary flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5" />
              Take the Match Quiz
            </Link>
            <Link href="/colleges" className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors">
              Browse All Colleges
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 40Q1320 0 1200 20Q1080 40 960 20Q840 0 720 20Q600 40 480 20Q360 0 240 20Q120 40 0 20L0 80Z" fill="white" className="dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "text-center card p-6 transition-all duration-500",
                  animatedStats ? "animate-scale-in opacity-100" : "opacity-0"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={cn("inline-flex p-3 rounded-xl bg-muted dark:bg-slate-800 mb-3")}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="font-heading font-bold text-2xl sm:text-3xl text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="badge-primary mb-4">Everything You Need</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Complete College Decision Toolkit
            </h2>
            <div className="section-divider" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              From discovery to decision — we have every tool you need to make the right choice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={cn("card-hover p-6 group", feature.bg)}
              >
                <div className={cn("inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 shadow-md", feature.color)}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ POPULAR COLLEGES ═══════════════ */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="badge-amber mb-4">Trending Now</div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                Popular Colleges
              </h2>
            </div>
            <Link href="/colleges" className="btn-outline text-sm py-2.5 hidden sm:flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularColleges.map((college, i) => (
              <Link
                key={college.slug}
                href={`/colleges/${college.slug}`}
                className="card-hover p-5 flex items-start gap-4"
              >
                {/* Logo placeholder */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-glow">
                  {college.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-foreground truncate">{college.name}</h3>
                    <span className="badge-primary flex-shrink-0 text-[10px]">#{college.rank}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {college.location}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{college.rating}</span>
                    </div>
                    <span className="badge text-[10px] bg-muted dark:bg-slate-700">{college.type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/colleges" className="btn-outline">View All Colleges</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="badge-primary mb-4">Simple Process</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Campus Compass Works
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-12 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-primary/30 via-amber/50 to-primary/30" />

            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center card p-6 hover:shadow-card-hover transition-all duration-300">
                {/* Step number */}
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="badge-green mb-4">Student Stories</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Students Across India
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover p-6 relative">
                {/* Quote mark */}
                <div className="text-6xl text-primary/10 font-serif absolute top-4 right-5 leading-none select-none">
                  &ldquo;
                </div>
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Find Your Dream College?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join 1.2 lakh+ students who made smarter college decisions with Campus Compass.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-secondary text-base px-8 py-3.5">
              Create Free Account
            </Link>
            <Link href="/quiz" className="flex items-center gap-2 text-white font-semibold hover:text-amber-300 transition-colors">
              Take the Quiz First
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">No credit card required • 100% free for students</p>
        </div>
      </section>
    </div>
  );
}
