import { MapPin, Globe, Calendar, Users, Award, GraduationCap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OverviewTab({ college }: { college: any }) {
  const ratingCategories = [
    { key: "academics", label: "Academics" },
    { key: "campusLife", label: "Campus Life" },
    { key: "placements", label: "Placements" },
    { key: "facultyQuality", label: "Faculty Quality" },
    { key: "infrastructure", label: "Infrastructure" },
    { key: "valueForMoney", label: "Value for Money" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* About */}
        <div className="card p-6">
          <h2 className="font-heading font-bold text-lg text-foreground mb-3">About {college.name}</h2>
          <p className="text-muted-foreground leading-relaxed">{college.description}</p>
        </div>

        {/* Quick Facts */}
        <div className="card p-6">
          <h2 className="font-heading font-bold text-lg text-foreground mb-4">Quick Facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: MapPin, label: "Location", value: `${college.location.city}, ${college.location.state}` },
              { icon: GraduationCap, label: "Type", value: college.type },
              { icon: Calendar, label: "Established", value: college.establishedYear || "N/A" },
              { icon: Award, label: "NAAC Grade", value: college.naacGrade || "N/A" },
              { icon: Award, label: "NIRF Rank", value: college.nirfRanking ? `#${college.nirfRanking}` : "N/A" },
              { icon: Users, label: "Total Students", value: college.totalStudents?.toLocaleString("en-IN") || "N/A" },
            ].map((fact) => (
              <div key={fact.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 dark:bg-slate-800/50">
                <fact.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{fact.label}</div>
                  <div className="font-semibold text-sm text-foreground">{String(fact.value)}</div>
                </div>
              </div>
            ))}
          </div>
          {college.affiliatedUniversity && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-sm">
              <span className="text-muted-foreground">Affiliated to: </span>
              <span className="font-semibold text-foreground">{college.affiliatedUniversity}</span>
            </div>
          )}
        </div>

        {/* Top Recruiters */}
        {college.topRecruiters && college.topRecruiters.length > 0 && (
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">Top Recruiters</h2>
            <div className="flex flex-wrap gap-2">
              {college.topRecruiters.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 dark:bg-slate-800/50 text-sm font-medium">
                  {r.logo ? (
                    <img src={r.logo} alt={r.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {r.name.charAt(0)}
                    </div>
                  )}
                  {r.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable Alumni */}
        {college.notableAlumni && college.notableAlumni.length > 0 && (
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">Notable Alumni</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {college.notableAlumni.map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.designation}{a.company ? ` @ ${a.company}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Rating Breakdown */}
        {college.totalReviews > 0 && (
          <div className="card p-5">
            <h3 className="font-heading font-bold text-base mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {ratingCategories.map((cat) => {
                const val = college.ratingBreakdown?.[cat.key] || 0;
                return (
                  <div key={cat.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{cat.label}</span>
                      <span className="font-semibold">{val.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500",
                          val >= 4 ? "bg-green-500" : val >= 3 ? "bg-amber-500" : "bg-red-400"
                        )}
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="card p-5">
          <h3 className="font-heading font-bold text-base mb-3">Quick Links</h3>
          <div className="space-y-2">
            {college.officialWebsite && (
              <a href={college.officialWebsite} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Globe className="w-4 h-4" /> Official Website <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {college.admissionLink && (
              <a href={college.admissionLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline">
                <GraduationCap className="w-4 h-4" /> Apply Now <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
