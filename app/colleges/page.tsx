"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CollegeCard from "@/components/colleges/CollegeCard";
import FilterSidebar from "@/components/colleges/FilterSidebar";
import type { Metadata } from "next";

interface College {
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
}

const SORT_OPTIONS = [
  { value: "ranking", label: "NIRF Ranking" },
  { value: "rating", label: "Highest Rated" },
  { value: "fees_asc", label: "Fees: Low to High" },
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

function CollegesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "ranking");

  const fetchColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sort);

      const res = await fetch(`/api/colleges?${params.toString()}`);
      const data = await res.json();
      setColleges(data.colleges || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, sort]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("q", searchInput);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/colleges?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const activeFilterCount = ["state", "city", "type", "exam", "minRating"].filter(
    (key) => searchParams.has(key)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search colleges, cities, courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                id="colleges-search"
                className="input-field pl-10 pr-4 py-2.5 text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); handleSearch({ preventDefault: () => {} } as any); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2">
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                  showFilters
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-foreground"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                id="colleges-sort"
                className="input-field py-2.5 text-sm pr-8 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : (
                <>
                  <span className="font-semibold text-foreground">{pagination.total}</span> colleges found
                  {searchParams.get("q") && (
                    <> for &ldquo;<span className="font-medium text-primary">{searchParams.get("q")}</span>&rdquo;</>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <FilterSidebar />
            </div>
          )}

          {/* College Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card h-64 skeleton" />
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">No colleges found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => router.push("/colleges")}
                  className="btn-outline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {colleges.map((college) => (
                    <CollegeCard key={college._id} college={college} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                            pagination.page === page
                              ? "bg-primary text-white shadow-glow"
                              : "border border-border hover:bg-muted text-foreground"
                          )}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CollegesListContent />
    </Suspense>
  );
}
