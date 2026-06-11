"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn, INDIAN_STATES, ENTRANCE_EXAMS } from "@/lib/utils";

const COLLEGE_TYPES = ["Public", "Private", "Deemed University", "Autonomous"];
const RATING_OPTIONS = [
  { value: "4.5", label: "4.5+ ⭐⭐⭐⭐⭐" },
  { value: "4.0", label: "4.0+ ⭐⭐⭐⭐" },
  { value: "3.5", label: "3.5+ ⭐⭐⭐" },
];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const clearAll = () => router.push("/colleges");

  const activeFilters = ["state", "city", "type", "exam", "minRating", "minRank", "maxRank"].filter(
    (k) => searchParams.has(k)
  ).length;

  return (
    <div className="card p-4 sticky top-36">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground">Filters</h3>
        {activeFilters > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            <X className="w-3 h-3" /> Clear all ({activeFilters})
          </button>
        )}
      </div>

      {/* State */}
      <FilterSection title="State">
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
          {INDIAN_STATES.slice(0, 15).map((state) => (
            <label key={state} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="state"
                value={state}
                checked={searchParams.get("state") === state}
                onChange={(e) => updateFilter("state", e.target.checked ? state : null)}
                className="text-primary accent-primary"
              />
              <span className={cn(
                "text-xs transition-colors",
                searchParams.get("state") === state ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {state}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* College Type */}
      <FilterSection title="College Type">
        <div className="space-y-1">
          {COLLEGE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value={type}
                checked={searchParams.get("type") === type}
                onChange={(e) => updateFilter("type", e.target.checked ? type : null)}
                className="accent-primary"
              />
              <span className={cn(
                "text-xs",
                searchParams.get("type") === type ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                value={opt.value}
                checked={searchParams.get("minRating") === opt.value}
                onChange={(e) => updateFilter("minRating", e.target.checked ? opt.value : null)}
                className="accent-primary"
              />
              <span className={cn(
                "text-xs",
                searchParams.get("minRating") === opt.value ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Entrance Exam */}
      <FilterSection title="Entrance Exam">
        <select
          value={searchParams.get("exam") || ""}
          onChange={(e) => updateFilter("exam", e.target.value || null)}
          id="filter-exam"
          className="input-field text-xs py-2"
        >
          <option value="">Any Exam</option>
          {ENTRANCE_EXAMS.map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </FilterSection>

      {/* NIRF Rank Range */}
      <FilterSection title="NIRF Ranking Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={searchParams.get("minRank") || ""}
            onChange={(e) => updateFilter("minRank", e.target.value || null)}
            id="filter-min-rank"
            className="input-field text-xs py-2 w-20"
            min="1"
          />
          <span className="text-muted-foreground text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={searchParams.get("maxRank") || ""}
            onChange={(e) => updateFilter("maxRank", e.target.value || null)}
            id="filter-max-rank"
            className="input-field text-xs py-2 w-20"
            min="1"
          />
        </div>
      </FilterSection>
    </div>
  );
}
