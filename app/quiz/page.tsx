"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle, Star, MapPin,
  Loader2, Award, TrendingUp, ArrowRight, RotateCcw
} from "lucide-react";
import { cn, INDIAN_STATES, STREAMS, ENTRANCE_EXAMS, formatCurrency } from "@/lib/utils";
import Link from "next/link";

const QUESTIONS = [
  {
    id: "stream",
    title: "What stream are you interested in?",
    subtitle: "Choose your primary field of study",
    type: "single",
    options: STREAMS,
    icon: "📚",
  },
  {
    id: "location",
    title: "Where do you prefer to study?",
    subtitle: "Select up to 3 preferred states",
    type: "multi",
    max: 3,
    options: ["Any Location", ...INDIAN_STATES.slice(0, 20)],
    icon: "📍",
  },
  {
    id: "budget",
    title: "What's your annual budget?",
    subtitle: "Including tuition fees",
    type: "single",
    options: ["Below ₹2 Lakh", "₹2L - ₹5L", "₹5L - ₹10L", "Above ₹10 Lakh"],
    values: ["below-2L", "2L-5L", "5L-10L", "above-10L"],
    icon: "💰",
  },
  {
    id: "collegeType",
    title: "Which type of college do you prefer?",
    subtitle: "Government or private institutions",
    type: "single",
    options: ["Public / Government", "Private", "Any Type"],
    values: ["Public", "Private", "Any"],
    icon: "🏛️",
  },
  {
    id: "entranceExam",
    title: "Which entrance exam are you preparing for?",
    subtitle: "We'll show colleges that accept it",
    type: "single",
    options: ["Any / Not decided", ...ENTRANCE_EXAMS.slice(0, 12)],
    values: ["Any", ...ENTRANCE_EXAMS.slice(0, 12)],
    icon: "📝",
  },
  {
    id: "careerGoal",
    title: "What's your primary career goal?",
    subtitle: "This helps us match placement-focused vs research-focused colleges",
    type: "single",
    options: ["Get placed in top companies", "Research & Academia", "Start my own business", "Study abroad for higher education"],
    values: ["placement", "research", "entrepreneurship", "abroad"],
    icon: "🎯",
  },
  {
    id: "priorities",
    title: "What matters most to you? (Pick up to 3)",
    subtitle: "We'll prioritize these in our matching",
    type: "multi",
    max: 3,
    options: ["High Placements", "Campus Life", "Research Opportunities", "Faculty Quality", "Low Fees", "International Exposure"],
    values: ["placements", "campus-life", "research", "faculty", "fees", "international"],
    icon: "⭐",
  },
  {
    id: "campusSize",
    title: "Preferred campus size?",
    subtitle: "Small campuses are more intimate; large ones have more resources",
    type: "single",
    options: ["Small (< 5,000 students)", "Medium (5K - 15K)", "Large (> 15,000 students)", "No Preference"],
    values: ["small", "medium", "large", "any"],
    icon: "🏫",
  },
];

interface CollegeResult {
  college: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    location: { city: string; state: string };
    type: string;
    nirfRanking?: number;
    avgRating: number;
    averagePackage?: number;
    naacGrade?: string;
  };
  matchPercentage: number;
  matchReasons: string[];
}

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep) / QUESTIONS.length) * 100;

  const getAnswer = (questionId: string) => answers[questionId];

  const handleSingleSelect = (value: string, questionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (value: string, questionId: string, max: number) => {
    const current: string[] = getAnswer(questionId) || [];
    if (current.includes(value)) {
      setAnswers((prev) => ({ ...prev, [questionId]: current.filter((v) => v !== value) }));
    } else if (current.length < max) {
      setAnswers((prev) => ({ ...prev, [questionId]: [...current, value] }));
    } else {
      toast.error(`You can select up to ${max} options`);
    }
  };

  const isAnswered = (questionId: string) => {
    const ans = getAnswer(questionId);
    return ans && (typeof ans === "string" ? ans.length > 0 : ans.length > 0);
  };

  const handleNext = () => {
    if (!isAnswered(question.id)) {
      toast.error("Please select an answer to continue");
      return;
    }
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Map display values to API values
      const mappedAnswers: any = {};
      QUESTIONS.forEach((q) => {
        const ans = answers[q.id];
        if (q.values && q.type === "single") {
          const idx = q.options.indexOf(ans);
          mappedAnswers[q.id] = idx >= 0 && q.values[idx] ? q.values[idx] : ans;
        } else if (q.values && q.type === "multi") {
          mappedAnswers[q.id] = (ans || []).map((a: string) => {
            const idx = q.options.indexOf(a);
            return idx >= 0 && q.values![idx] ? q.values![idx] : a;
          });
        } else {
          mappedAnswers[q.id] = ans;
        }
      });

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappedAnswers),
      });
      const data = await res.json();
      setResults(data.results || []);
      setShowResults(true);
    } catch {
      toast.error("Failed to get results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults([]);
    setShowResults(false);
  };

  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-scale-in">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Your Top College Matches
            </h1>
            <p className="text-muted-foreground text-lg">
              Based on your preferences, here are your best-fit colleges
            </p>
          </div>

          {results.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-muted-foreground">No matching colleges found. Try adjusting your preferences.</p>
              <button onClick={resetQuiz} className="btn-primary mt-4">Retake Quiz</button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, i) => (
                <div
                  key={result.college._id}
                  className={cn(
                    "card-hover p-6 flex flex-col sm:flex-row gap-5 items-start animate-slide-up",
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Rank */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-bold text-xl flex-shrink-0",
                    i === 0 ? "bg-amber text-white shadow-glow-amber" :
                    i === 1 ? "bg-slate-400 text-white" :
                    i === 2 ? "bg-orange-400 text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    #{i + 1}
                  </div>

                  {/* College info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading font-bold text-lg text-foreground">{result.college.name}</h2>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {result.college.location.city}, {result.college.location.state}
                          </span>
                          <span className="badge text-[10px] bg-muted dark:bg-slate-700">{result.college.type}</span>
                          {result.college.nirfRanking && (
                            <span className="badge-primary text-[10px]">NIRF #{result.college.nirfRanking}</span>
                          )}
                        </div>
                      </div>

                      {/* Match % */}
                      <div className="text-right flex-shrink-0">
                        <div className={cn(
                          "text-2xl font-heading font-bold",
                          result.matchPercentage >= 80 ? "text-green-600 dark:text-green-400" :
                          result.matchPercentage >= 60 ? "text-amber-600 dark:text-amber-400" :
                          "text-slate-600 dark:text-slate-400"
                        )}>
                          {result.matchPercentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">match</div>
                        {/* Progress bar */}
                        <div className="w-20 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-700",
                              result.matchPercentage >= 80 ? "bg-green-500" :
                              result.matchPercentage >= 60 ? "bg-amber-500" : "bg-slate-400"
                            )}
                            style={{ width: `${result.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold">{result.college.avgRating > 0 ? result.college.avgRating.toFixed(1) : "N/A"}</span>
                      </div>
                      {result.college.averagePackage && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-semibold">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {formatCurrency(result.college.averagePackage)} avg pkg
                        </div>
                      )}
                      {result.college.naacGrade && (
                        <span className="badge-green text-[10px]">NAAC {result.college.naacGrade}</span>
                      )}
                    </div>

                    {/* Match reasons */}
                    {result.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {result.matchReasons.map((reason, j) => (
                          <span key={j} className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full border border-green-200 dark:border-green-800/40">
                            <CheckCircle className="w-3 h-3" />
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/colleges/${result.college.slug}`}
                    className="btn-primary text-sm py-2.5 px-5 flex items-center gap-1.5 flex-shrink-0 self-center"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button onClick={resetQuiz} className="btn-outline flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <Link href="/colleges" className="btn-primary flex items-center gap-2">
              Browse All Colleges
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-amber transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="text-center mb-8">
            <span className="text-sm text-muted-foreground font-medium">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i < currentStep ? "w-6 bg-primary" :
                    i === currentStep ? "w-8 bg-primary" :
                    "w-3 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{question.icon}</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {question.title}
              </h2>
              <p className="text-muted-foreground">{question.subtitle}</p>
              {question.type === "multi" && (
                <p className="text-xs text-primary mt-1">
                  Select up to {question.max} • {(getAnswer(question.id) || []).length}/{question.max} selected
                </p>
              )}
            </div>

            {/* Options */}
            <div className={cn(
              "grid gap-2",
              question.options.length > 6 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
            )}>
              {question.options.map((option, i) => {
                const isSelected = question.type === "single"
                  ? getAnswer(question.id) === option
                  : (getAnswer(question.id) || []).includes(option);

                return (
                  <button
                    key={option}
                    onClick={() => {
                      if (question.type === "single") {
                        handleSingleSelect(option, question.id);
                      } else {
                        handleMultiSelect(option, question.id, question.max || 3);
                      }
                    }}
                    className={cn(
                      "relative px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 border-2",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted text-foreground"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                    )}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-xl hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              id={currentStep === QUESTIONS.length - 1 ? "quiz-submit" : `quiz-next-${currentStep}`}
              className={cn(
                "btn-primary flex items-center gap-2",
                !isAnswered(question.id) && "opacity-60 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentStep === QUESTIONS.length - 1 ? (
                <>
                  Find My Matches
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
