import { BookOpen, Clock, IndianRupee, Award, Users } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  UG: "badge-primary",
  PG: "badge-amber",
  PhD: "badge-green",
  Diploma: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Certificate: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export default function CoursesTab({ courses, college }: { courses: any[]; college: any }) {
  const grouped = courses.reduce((acc: any, course: any) => {
    const type = course.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(course);
    return acc;
  }, {});

  if (courses.length === 0) {
    return (
      <div className="card p-8 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No courses listed yet for this college.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([type, typeCourses]: [string, any]) => (
        <div key={type}>
          <div className="flex items-center gap-2 mb-4">
            <span className={cn("badge text-sm px-3 py-1", TYPE_COLORS[type] || "badge-primary")}>{type} Programs</span>
            <span className="text-muted-foreground text-sm">({(typeCourses as any[]).length} courses)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(typeCourses as any[]).map((course: any, i: number) => (
              <div key={i} className="card p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-heading font-bold text-foreground">{course.name}</h3>
                  {course.scholarshipAvailable && (
                    <span className="badge badge-green flex-shrink-0 text-[10px]">
                      <Award className="w-2.5 h-2.5 mr-1" />
                      Scholarship
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  {course.seats && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>{course.seats} seats</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 col-span-2">
                    <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {formatCurrency(course.annualFee)}/year
                    </span>
                    {course.totalFee && (
                      <span className="text-muted-foreground text-xs">
                        (Total: {formatCurrency(course.totalFee)})
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Eligibility: </span>
                    {course.eligibility}
                  </div>
                  {course.specializations && course.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {course.specializations.map((s: string, j: number) => (
                        <span key={j} className="badge bg-muted dark:bg-slate-700 text-muted-foreground text-[10px]">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
