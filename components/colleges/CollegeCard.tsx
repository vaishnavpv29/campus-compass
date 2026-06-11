"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  MapPin, Star, Award, Users, Bookmark, BookmarkCheck, GitCompare,
  ExternalLink, TrendingUp, GraduationCap
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useComparisonStore } from "@/store/comparisonStore";

interface CollegeCardProps {
  college: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    bannerImage?: string;
    location: { city: string; state: string };
    type: string;
    nirfRanking?: number;
    naacGrade?: string;
    avgRating: number;
    totalReviews: number;
    averagePackage?: number;
    placementPercentage?: number;
    entranceExams?: string[];
    totalStudents?: number;
  };
  compact?: boolean;
}

export default function CollegeCard({ college, compact }: CollegeCardProps) {
  const { data: session } = useSession();
  const { addCollege, removeCollege, hasCollege } = useComparisonStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isInComparison = hasCollege(college._id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Sign in to save colleges to your wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      const method = isWishlisted ? "DELETE" : "POST";
      await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college._id }),
      });
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist! 🔖");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

      if (added) {
        toast.success("Added to comparison tray!");
      } else {
        toast.error("You can compare up to 3 colleges at a time");
      }
    }
  };

  const initials = college.name
    .split(" ")
    .filter((w) => ["IIT", "IIM", "NIT", "BITS", "VIT", "AIIMS", "NLSIU"].includes(w) || w.length > 3)
    .slice(0, 1)
    .join("")
    .charAt(0) || college.name.charAt(0);

  return (
    <Link href={`/colleges/${college.slug}`} className="block group">
      <div className="card-hover h-full flex flex-col overflow-hidden">
        {/* Banner / Header */}
        <div className="relative h-28 bg-gradient-to-br from-primary via-blue-600 to-sky-500 overflow-hidden">
          {college.bannerImage && (
            <img
              src={college.bannerImage}
              alt={college.name}
              className="w-full h-full object-cover opacity-60"
            />
          )}
          {/* Overlay pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Actions */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              onClick={handleCompare}
              title={isInComparison ? "Remove from comparison" : "Add to comparison"}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                isInComparison
                  ? "bg-amber text-white shadow-glow-amber"
                  : "bg-black/30 text-white hover:bg-amber/80 backdrop-blur-sm"
              )}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                isWishlisted
                  ? "bg-primary text-white"
                  : "bg-black/30 text-white hover:bg-primary/80 backdrop-blur-sm"
              )}
            >
              {isWishlisted ? (
                <BookmarkCheck className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* NIRF Rank */}
          {college.nirfRanking && (
            <div className="absolute top-2 left-2 badge bg-amber/90 text-white text-[10px] font-bold px-2 py-0.5">
              NIRF #{college.nirfRanking}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* College Logo + Name */}
          <div className="flex items-start gap-3 -mt-8 mb-3 relative">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border-2 border-border shadow-card flex items-center justify-center flex-shrink-0 overflow-hidden">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="w-12 h-12 object-contain p-1" />
              ) : (
                <span className="text-xl font-heading font-bold text-primary">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 pt-8">
              <h3 className="font-heading font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {college.name}
              </h3>
            </div>
          </div>

          {/* Location & Type */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{college.location.city}, {college.location.state}</span>
            </div>
            <span className={cn(
              "badge text-[10px]",
              college.type === "Public" ? "badge-primary" : "badge-amber"
            )}>
              {college.type}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-sm">{college.avgRating > 0 ? college.avgRating.toFixed(1) : "N/A"}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({college.totalReviews} reviews)
            </span>
            {college.naacGrade && (
              <span className="ml-auto badge badge-green text-[10px]">
                NAAC {college.naacGrade}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-border">
            {college.averagePackage && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Avg Package</div>
                <div className="font-semibold text-sm text-foreground">{formatCurrency(college.averagePackage)}</div>
              </div>
            )}
            {college.placementPercentage && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Placements</div>
                <div className="font-semibold text-sm text-green-600 dark:text-green-400">{college.placementPercentage}%</div>
              </div>
            )}
            {college.totalStudents && !college.averagePackage && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Students</div>
                <div className="font-semibold text-sm">{college.totalStudents.toLocaleString("en-IN")}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
