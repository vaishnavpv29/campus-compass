"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  MapPin, Star, Globe, ExternalLink, Bookmark, BookmarkCheck,
  GitCompare, Award, Users, Calendar, CheckCircle, ChevronLeft,
  Loader2
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useComparisonStore } from "@/store/comparisonStore";
import OverviewTab from "@/components/colleges/tabs/OverviewTab";
import CoursesTab from "@/components/colleges/tabs/CoursesTab";
import PlacementsTab from "@/components/colleges/tabs/PlacementsTab";
import CampusLifeTab from "@/components/colleges/tabs/CampusLifeTab";
import AdmissionTab from "@/components/colleges/tabs/AdmissionTab";
import ReviewsList from "@/components/reviews/ReviewsList";
import ComparisonTray from "@/components/comparison/ComparisonTray";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses & Fees" },
  { id: "placements", label: "Placements" },
  { id: "campus", label: "Campus Life" },
  { id: "admission", label: "Admission" },
  { id: "reviews", label: "Reviews" },
];

export default function CollegeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { addCollege, removeCollege, hasCollege } = useComparisonStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [college, setCollege] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (!res.ok) {
          router.push("/colleges");
          return;
        }
        const data = await res.json();
        setCollege(data.college);
        setCourses(data.courses);
        setReviews(data.reviews);
      } catch {
        toast.error("Failed to load college");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollege();
  }, [id, router]);

  const isInComparison = college ? hasCollege(college._id) : false;

  const handleCompare = () => {
    if (!college) return;
    if (isInComparison) {
      removeCollege(college._id);
      toast.success("Removed from comparison");
    } else {
      const added = addCollege({
        id: college._id,
        name: college.name,
        logo: college.logo,
        location: `${college.location.city}, ${college.location.state}`,
        nirfRanking: college.nirfRanking,
        avgRating: college.avgRating,
        type: college.type,
      });
      if (added) toast.success("Added to comparison! 🆚");
      else toast.error("Max 3 colleges in comparison");
    }
  };

  const handleWishlist = async () => {
    if (!session) { toast.error("Sign in to save colleges"); return; }
    const method = isWishlisted ? "DELETE" : "POST";
    await fetch("/api/wishlist", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId: college._id }),
    });
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist! 🔖");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!college) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-72 bg-gradient-to-br from-primary via-blue-700 to-sky-600 overflow-hidden">
        {college.bannerImage && (
          <img src={college.bannerImage} alt="" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* College info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-white/30 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="w-16 h-16 object-contain p-1" />
              ) : (
                <span className="text-2xl font-heading font-bold text-primary">{college.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {college.nirfRanking && (
                  <span className="badge bg-amber/90 text-white text-xs font-bold">NIRF #{college.nirfRanking}</span>
                )}
                {college.naacGrade && (
                  <span className="badge bg-green-500/90 text-white text-xs font-bold">NAAC {college.naacGrade}</span>
                )}
                <span className="badge bg-white/20 text-white text-xs">{college.type}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                {college.name}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {college.location.city}, {college.location.state}
                </div>
                {college.establishedYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Est. {college.establishedYear}
                  </div>
                )}
                {college.totalStudents && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {formatNumber(college.totalStudents)} students
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between py-4 border-b border-border">
          {/* Rating summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn("w-4 h-4", i <= Math.round(college.avgRating) ? "star-filled" : "star-empty")}
                  />
                ))}
              </div>
              <span className="font-bold text-lg">{college.avgRating > 0 ? college.avgRating.toFixed(1) : "—"}</span>
              <span className="text-muted-foreground text-sm">({college.totalReviews} reviews)</span>
            </div>
            {college.officialWebsite && (
              <a
                href={college.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                Official Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompare}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",
                isInComparison
                  ? "border-amber bg-amber/10 text-amber-700 dark:text-amber-300"
                  : "border-border hover:border-primary/40 text-foreground"
              )}
            >
              <GitCompare className="w-4 h-4" />
              {isInComparison ? "In Comparison" : "Compare"}
            </button>
            <button
              onClick={handleWishlist}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2",
                isWishlisted
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40 text-foreground"
              )}
            >
              {isWishlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isWishlisted ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border sticky top-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-20 -mx-4 px-4 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
              className={cn(
                "px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              {tab.label}
              {tab.id === "reviews" && college.totalReviews > 0 && (
                <span className="ml-1.5 badge-primary text-[10px] py-0 px-1.5">{college.totalReviews}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "overview" && <OverviewTab college={college} />}
          {activeTab === "courses" && <CoursesTab courses={courses} college={college} />}
          {activeTab === "placements" && <PlacementsTab college={college} />}
          {activeTab === "campus" && <CampusLifeTab college={college} />}
          {activeTab === "admission" && <AdmissionTab college={college} />}
          {activeTab === "reviews" && (
            <ReviewsList
              collegeId={college._id}
              initialReviews={reviews}
              collegeName={college.name}
            />
          )}
        </div>
      </div>

      {/* Comparison Tray */}
      <ComparisonTray />
    </div>
  );
}
