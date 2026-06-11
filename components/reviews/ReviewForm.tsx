"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Star, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  pros: z.string().min(20, "Pros must be at least 20 characters").max(1000),
  cons: z.string().min(20, "Cons must be at least 20 characters").max(1000),
  advice: z.string().max(500).optional(),
  batch: z.string().optional(),
  course: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const RATING_CATEGORIES = [
  { key: "academics", label: "Academics" },
  { key: "campusLife", label: "Campus Life" },
  { key: "placements", label: "Placements" },
  { key: "facultyQuality", label: "Faculty Quality" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "valueForMoney", label: "Value for Money" },
];

interface ReviewFormProps {
  collegeId: string;
  collegeName: string;
  onSubmit: (review: any) => void;
  onCancel: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              i <= (hover || value) ? "star-filled" : "star-empty"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ collegeId, collegeName, onSubmit, onCancel }: ReviewFormProps) {
  const [ratings, setRatings] = useState({
    academics: 0, campusLife: 0, placements: 0,
    facultyQuality: 0, infrastructure: 0, valueForMoney: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const allRated = Object.values(ratings).every((v) => v > 0);

  const onFormSubmit = async (data: ReviewFormData) => {
    if (!allRated) {
      toast.error("Please rate all 6 categories");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId, ratings, ...data }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message);
        return;
      }

      const review = await res.json();
      onSubmit(review);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 border-2 border-primary/20 animate-slide-down">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg">Write a Review</h3>
          <p className="text-muted-foreground text-sm">{collegeName}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Star Ratings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/40 dark:bg-slate-800/40 rounded-xl">
        {RATING_CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
            <StarPicker
              value={ratings[key as keyof typeof ratings]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
            />
          </div>
        ))}
      </div>
      {!allRated && (
        <p className="text-amber-600 text-xs mb-4">⚠️ Please rate all 6 categories above</p>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Course & Batch */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Your Course</label>
            <input type="text" placeholder="e.g., B.Tech CSE" {...register("course")} className="input-field text-sm py-2.5" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Batch Year</label>
            <input type="text" placeholder="e.g., 2020-24" {...register("batch")} className="input-field text-sm py-2.5" />
          </div>
        </div>

        {/* Pros */}
        <div>
          <label className="text-sm font-medium mb-1 block text-green-600 dark:text-green-400">
            👍 Pros (What&apos;s great about this college?)
          </label>
          <textarea
            {...register("pros")}
            rows={3}
            placeholder="Talk about the good aspects — faculty, placements, infrastructure, campus life..."
            className={cn("input-field text-sm resize-none", errors.pros && "border-red-500")}
          />
          {errors.pros && <p className="text-red-500 text-xs mt-1">{errors.pros.message}</p>}
        </div>

        {/* Cons */}
        <div>
          <label className="text-sm font-medium mb-1 block text-red-500">
            👎 Cons (What could be better?)
          </label>
          <textarea
            {...register("cons")}
            rows={3}
            placeholder="Be honest about shortcomings — administration, food, hostel, fees..."
            className={cn("input-field text-sm resize-none", errors.cons && "border-red-500")}
          />
          {errors.cons && <p className="text-red-500 text-xs mt-1">{errors.cons.message}</p>}
        </div>

        {/* Advice */}
        <div>
          <label className="text-sm font-medium mb-1 block text-amber-600 dark:text-amber-400">
            💡 Advice (Optional — Tips for prospective students)
          </label>
          <textarea
            {...register("advice")}
            rows={2}
            placeholder="What should students know before joining?"
            className="input-field text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-outline flex-1 py-2.5">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !allRated}
            id="submit-review"
            className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
