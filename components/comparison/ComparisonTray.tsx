"use client";

import Link from "next/link";
import { useComparisonStore } from "@/store/comparisonStore";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparisonTray() {
  const { colleges, removeCollege, clearAll } = useComparisonStore();

  if (colleges.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 comparison-tray">
      <div className="bg-white dark:bg-slate-900 border-t-2 border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Icon + Label */}
            <div className="flex items-center gap-2 text-primary flex-shrink-0">
              <GitCompare className="w-5 h-5" />
              <span className="font-semibold text-sm hidden sm:block">Compare</span>
              <span className="badge-primary text-xs">{colleges.length}/3</span>
            </div>

            {/* College Pills */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
              {colleges.map((college) => (
                <div
                  key={college.id}
                  className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-xl px-3 py-1.5 flex-shrink-0"
                >
                  {college.logo ? (
                    <img src={college.logo} alt={college.name} className="w-5 h-5 object-contain rounded" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {college.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground max-w-[120px] truncate">{college.name}</span>
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Empty slots */}
              {colleges.length < 3 && [...Array(3 - colleges.length)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border-2 border-dashed border-border rounded-xl px-3 py-1.5 text-xs text-muted-foreground flex-shrink-0"
                >
                  <div className="w-5 h-5 rounded border-2 border-dashed border-muted-foreground/30" />
                  Add college
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear
              </button>
              <Link
                href="/compare"
                id="compare-now-btn"
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all",
                  colleges.length >= 2
                    ? "btn-primary"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Compare Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
