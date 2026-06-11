import Link from "next/link";
import { FileText, Calendar, ExternalLink, Award } from "lucide-react";
import { ENTRANCE_EXAMS } from "@/lib/utils";

export default function AdmissionTab({ college }: { college: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Entrance Exams */}
      {college.entranceExams && college.entranceExams.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-base">Entrance Exams Accepted</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {college.entranceExams.map((exam: string, i: number) => (
              <span key={i} className="badge badge-primary px-3 py-1.5 text-sm font-semibold">{exam}</span>
            ))}
          </div>
        </div>
      )}

      {/* Important Dates */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-amber" />
          <h2 className="font-heading font-bold text-base">Important Dates</h2>
        </div>
        <div className="space-y-3">
          {college.applicationDeadline && (
            <div className="flex items-start justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <div>
                <div className="font-semibold text-sm">Application Deadline</div>
                <div className="text-amber-600 dark:text-amber-400 text-sm">{college.applicationDeadline}</div>
              </div>
              <Calendar className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
            </div>
          )}
          {!college.applicationDeadline && (
            <p className="text-muted-foreground text-sm">Check the official website for current admission dates.</p>
          )}
        </div>
      </div>

      {/* Cutoff Ranks */}
      {college.cutoffRanks && Object.keys(college.cutoffRanks).length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-500" />
            <h2 className="font-heading font-bold text-base">Cutoff Ranks</h2>
          </div>
          <div className="space-y-2">
            {Object.entries(college.cutoffRanks).map(([exam, rank]: [string, any], i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 dark:bg-slate-800/50 rounded-xl">
                <span className="font-medium text-sm">{exam}</span>
                <span className="badge badge-green font-bold">Rank: {rank.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Now */}
      <div className="card p-6">
        <h2 className="font-heading font-bold text-base mb-4">How to Apply</h2>
        <div className="space-y-3">
          {["Appear in the relevant entrance exam", "Check eligibility criteria", "Fill the online application form", "Submit documents and pay fees"].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              {step}
            </div>
          ))}
          {college.admissionLink && (
            <a
              href={college.admissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center mt-4 flex items-center justify-center gap-2"
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
