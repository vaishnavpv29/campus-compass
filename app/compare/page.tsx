"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GitCompare, X, Download, Star, CheckCircle, MapPin, Award, TrendingUp, GraduationCap, Loader2 } from "lucide-react";
import { useComparisonStore } from "@/store/comparisonStore";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface CollegeDetail {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  location: { city: string; state: string };
  type: string;
  nirfRanking?: number;
  naacGrade?: string;
  avgRating: number;
  totalReviews: number;
  averagePackage?: number;
  highestPackage?: number;
  placementPercentage?: number;
  totalStudents?: number;
  entranceExams?: string[];
  facilities?: Record<string, boolean>;
  ratingBreakdown?: Record<string, number>;
  establishedYear?: number;
}

const COMPARISON_ROWS = [
  { key: "location", label: "Location", format: (c: CollegeDetail) => `${c.location.city}, ${c.location.state}`, higher: false },
  { key: "type", label: "College Type", format: (c: CollegeDetail) => c.type, higher: false },
  { key: "nirfRanking", label: "NIRF Ranking", format: (c: CollegeDetail) => c.nirfRanking ? `#${c.nirfRanking}` : "N/A", higher: false, bestLower: true },
  { key: "naacGrade", label: "NAAC Grade", format: (c: CollegeDetail) => c.naacGrade || "N/A", higher: false },
  { key: "avgRating", label: "Overall Rating", format: (c: CollegeDetail) => c.avgRating > 0 ? `⭐ ${c.avgRating.toFixed(1)}/5` : "N/A", higher: true },
  { key: "totalReviews", label: "Total Reviews", format: (c: CollegeDetail) => c.totalReviews.toString(), higher: true },
  { key: "averagePackage", label: "Avg Package", format: (c: CollegeDetail) => c.averagePackage ? formatCurrency(c.averagePackage) : "N/A", higher: true },
  { key: "highestPackage", label: "Highest Package", format: (c: CollegeDetail) => c.highestPackage ? formatCurrency(c.highestPackage) : "N/A", higher: true },
  { key: "placementPercentage", label: "Placement Rate", format: (c: CollegeDetail) => c.placementPercentage ? `${c.placementPercentage}%` : "N/A", higher: true },
  { key: "totalStudents", label: "Total Students", format: (c: CollegeDetail) => c.totalStudents?.toLocaleString("en-IN") || "N/A", higher: false },
  { key: "establishedYear", label: "Established", format: (c: CollegeDetail) => c.establishedYear?.toString() || "N/A", higher: false },
];

const RATING_ROWS = [
  { key: "academics", label: "Academics" },
  { key: "campusLife", label: "Campus Life" },
  { key: "placements", label: "Placements" },
  { key: "facultyQuality", label: "Faculty Quality" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "valueForMoney", label: "Value for Money" },
];

export default function ComparePage() {
  const router = useRouter();
  const { colleges: compareList, removeCollege, clearAll } = useComparisonStore();
  const [collegeDetails, setCollegeDetails] = useState<CollegeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compareList.length === 0) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const details = await Promise.all(
          compareList.map((c) =>
            fetch(`/api/colleges/${c.id}`).then((r) => r.json()).then((d) => d.college)
          )
        );
        setCollegeDetails(details.filter(Boolean));
      } catch {
        toast.error("Failed to load college details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [compareList]);

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      if (!tableRef.current) return;
      toast.info("Generating PDF...");
      const canvas = await html2canvas(tableRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save("college-comparison.pdf");
      toast.success("PDF downloaded!");
    } catch {
      toast.error("PDF export failed");
    }
  };

  const getBestValue = (row: typeof COMPARISON_ROWS[0]) => {
    if (!row.higher && !row.bestLower) return null;
    const values = collegeDetails.map((c) => {
      const val = (c as any)[row.key];
      return typeof val === "number" ? val : null;
    });
    if (values.every((v) => v === null)) return null;
    const validValues = values.filter((v): v is number => v !== null);
    if (row.bestLower) return Math.min(...validValues);
    return Math.max(...validValues);
  };

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <GitCompare className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Nothing to Compare Yet</h1>
          <p className="text-muted-foreground mb-6">
            Add up to 3 colleges from the college listing page using the compare button, then come back here.
          </p>
          <Link href="/colleges" className="btn-primary">Browse Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              College Comparison
            </h1>
            <p className="text-sm text-muted-foreground">Comparing {collegeDetails.length} colleges side-by-side</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportPDF}
              className="flex items-center gap-1.5 btn-outline text-sm py-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={tableRef} className="space-y-6">
            {/* College Headers */}
            <div className={cn("grid gap-4", `grid-cols-${collegeDetails.length + 1}`)}>
              <div /> {/* Label column spacer */}
              {collegeDetails.map((college) => (
                <div key={college._id} className="card p-4 text-center relative">
                  <button
                    onClick={() => removeCollege(college._id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-14 h-14 rounded-xl mx-auto mb-2 bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    {college.logo ? (
                      <img src={college.logo} alt={college.name} className="w-full h-full object-contain p-1" />
                    ) : college.name.charAt(0)}
                  </div>
                  <Link href={`/colleges/${college.slug}`} className="font-heading font-bold text-sm text-foreground hover:text-primary transition-colors">
                    {college.name}
                  </Link>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {college.location.city}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Comparison Table */}
            <div className="card overflow-hidden">
              <div className="bg-primary/5 dark:bg-primary/10 px-4 py-3 border-b border-border">
                <h2 className="font-heading font-bold text-sm text-primary uppercase tracking-wide">Key Statistics</h2>
              </div>
              <div className="divide-y divide-border">
                {COMPARISON_ROWS.map((row) => {
                  const bestValue = getBestValue(row);
                  return (
                    <div
                      key={row.key}
                      className={cn("grid gap-0 items-center", `grid-cols-${collegeDetails.length + 1}`)}
                    >
                      <div className="px-4 py-3 text-sm font-medium text-muted-foreground bg-muted/30 dark:bg-slate-800/30">
                        {row.label}
                      </div>
                      {collegeDetails.map((college) => {
                        const numVal = (college as any)[row.key];
                        const isBest = bestValue !== null && numVal === bestValue;
                        return (
                          <div
                            key={college._id}
                            className={cn(
                              "px-4 py-3 text-sm text-center font-medium border-l border-border",
                              isBest && "best-value"
                            )}
                          >
                            {row.format(college)}
                            {isBest && <span className="ml-1 text-green-500 text-xs">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="card overflow-hidden">
              <div className="bg-amber/5 dark:bg-amber/10 px-4 py-3 border-b border-border">
                <h2 className="font-heading font-bold text-sm text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  Rating Breakdown (Student Reviews)
                </h2>
              </div>
              <div className="divide-y divide-border">
                {RATING_ROWS.map((row) => {
                  const vals = collegeDetails.map((c) => c.ratingBreakdown?.[row.key] || 0);
                  const best = Math.max(...vals);
                  return (
                    <div
                      key={row.key}
                      className={cn("grid gap-0 items-center", `grid-cols-${collegeDetails.length + 1}`)}
                    >
                      <div className="px-4 py-3 text-sm font-medium text-muted-foreground bg-muted/30 dark:bg-slate-800/30">
                        {row.label}
                      </div>
                      {collegeDetails.map((college, i) => {
                        const val = college.ratingBreakdown?.[row.key] || 0;
                        const isBest = val === best && best > 0;
                        return (
                          <div
                            key={college._id}
                            className={cn(
                              "px-4 py-3 text-center border-l border-border",
                              isBest && "best-value"
                            )}
                          >
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-semibold">{val > 0 ? val.toFixed(1) : "N/A"}</span>
                            </div>
                            {val > 0 && (
                              <div className="h-1.5 bg-muted rounded-full mx-4 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", isBest ? "bg-green-500" : "bg-amber-400")}
                                  style={{ width: `${(val / 5) * 100}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Facilities */}
            <div className="card overflow-hidden">
              <div className="bg-green-50 dark:bg-green-950/20 px-4 py-3 border-b border-border">
                <h2 className="font-heading font-bold text-sm text-green-700 dark:text-green-400 uppercase tracking-wide">Campus Facilities</h2>
              </div>
              <div className="divide-y divide-border">
                {["hostelBoys", "hostelGirls", "mess", "gym", "library", "sportsComplex", "medicalCenter", "wifi"].map((facility) => {
                  const label = {
                    hostelBoys: "Boys Hostel", hostelGirls: "Girls Hostel", mess: "Mess/Cafeteria",
                    gym: "Gym", library: "Library", sportsComplex: "Sports Complex",
                    medicalCenter: "Medical Center", wifi: "Wi-Fi Campus",
                  }[facility];
                  return (
                    <div key={facility} className={cn("grid gap-0 items-center", `grid-cols-${collegeDetails.length + 1}`)}>
                      <div className="px-4 py-3 text-sm font-medium text-muted-foreground bg-muted/30 dark:bg-slate-800/30">{label}</div>
                      {collegeDetails.map((college) => (
                        <div key={college._id} className="px-4 py-3 text-center border-l border-border text-lg">
                          {college.facilities?.[facility] ? "✅" : "❌"}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entrance Exams */}
            <div className="card overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-950/20 px-4 py-3 border-b border-border">
                <h2 className="font-heading font-bold text-sm text-blue-700 dark:text-blue-400 uppercase tracking-wide">Entrance Exams Accepted</h2>
              </div>
              <div className={cn("grid gap-0", `grid-cols-${collegeDetails.length + 1}`)}>
                <div className="px-4 py-4 bg-muted/30 dark:bg-slate-800/30" />
                {collegeDetails.map((college) => (
                  <div key={college._id} className="px-4 py-4 border-l border-border">
                    <div className="flex flex-wrap gap-1">
                      {college.entranceExams?.map((exam, i) => (
                        <span key={i} className="badge badge-primary text-[10px]">{exam}</span>
                      )) || <span className="text-muted-foreground text-xs">N/A</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground justify-end">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded best-value border border-green-300" />
                Best value in category
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
