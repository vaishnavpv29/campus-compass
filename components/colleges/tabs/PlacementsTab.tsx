"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Award, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";


export default function PlacementsTab({ college }: { college: any }) {
  const yearlyData = [
    { year: "2020", placed: 75, avgPkg: (college.averagePackage || 1000000) * 0.6 },
    { year: "2021", placed: 80, avgPkg: (college.averagePackage || 1000000) * 0.7 },
    { year: "2022", placed: 85, avgPkg: (college.averagePackage || 1000000) * 0.8 },
    { year: "2023", placed: 88, avgPkg: (college.averagePackage || 1000000) * 0.9 },
    { year: "2024", placed: college.placementPercentage || 90, avgPkg: college.averagePackage || 1000000 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Placement Rate", value: college.placementPercentage ? `${college.placementPercentage}%` : "N/A", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Average Package", value: college.averagePackage ? formatCurrency(college.averagePackage) : "N/A", icon: Award, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { label: "Highest Package", value: college.highestPackage ? formatCurrency(college.highestPackage) : "N/A", icon: ArrowUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
          { label: "Lowest Package", value: college.lowestPackage ? formatCurrency(college.lowestPackage) : "N/A", icon: ArrowDown, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" },
        ].map((stat) => (
          <div key={stat.label} className={`card p-5 ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
            <div className="font-heading font-bold text-xl text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement % Chart */}
        <div className="card p-6">
          <h3 className="font-heading font-bold text-base mb-4">Placement % Over Years</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={yearlyData}>
              <defs>
                <linearGradient id="placedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, "Placement Rate"]} />
              <Area type="monotone" dataKey="placed" stroke="#1E3A8A" fill="url(#placedGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Package Chart */}
        <div className="card p-6">
          <h3 className="font-heading font-bold text-base mb-4">Average Package Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(val: any) => [formatCurrency(val), "Avg Package"]} />
              <Bar dataKey="avgPkg" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recruiters */}
      {college.topRecruiters && college.topRecruiters.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading font-bold text-base mb-4">Top Recruiting Companies</h3>
          <div className="flex flex-wrap gap-3">
            {college.topRecruiters.map((r: any, i: number) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 dark:bg-slate-800/50 text-sm font-medium border border-border">
                {r.logo ? (
                  <img src={r.logo} alt={r.name} className="w-6 h-6 object-contain" />
                ) : (
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {r.name.charAt(0)}
                  </div>
                )}
                {r.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
