"use client";

import { useState } from "react";
import { Star, ThumbsUp, Flag, CheckCircle, MoreVertical } from "lucide-react";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";

const RATING_LABELS = [
  { key: "academics", label: "Academics" },
  { key: "campusLife", label: "Campus Life" },
  { key: "placements", label: "Placements" },
  { key: "facultyQuality", label: "Faculty" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "valueForMoney", label: "Value" },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("w-3 h-3", i <= value ? "star-filled" : "star-empty")}
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: any;
  currentUserId?: string;
  onHelpful: (id: string, helpful: boolean, count: number) => void;
}

export default function ReviewCard({ review, currentUserId, onHelpful }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulVotes?.length || 0);
  const [hasVoted, setHasVoted] = useState(review.helpfulVotes?.includes(currentUserId));
  const [showRatings, setShowRatings] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);

  const handleHelpful = async () => {
    if (!currentUserId) {
      toast.error("Sign in to vote");
      return;
    }
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "helpful" }),
      });
      const data = await res.json();
      setHasVoted(data.helpful);
      setHelpfulCount(data.count);
      onHelpful(review._id, data.helpful, data.count);
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleFlag = async () => {
    if (!currentUserId) { toast.error("Sign in to report"); return; }
    try {
      await fetch(`/api/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", reason: "Inappropriate content" }),
      });
      toast.success("Review reported. Thank you!");
    } catch {
      toast.error("Failed to report");
    }
  };

  const author = review.author || {};

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            {author.image ? (
              <img src={author.image} alt={author.name} className="w-10 h-10 object-cover" />
            ) : (
              getInitials(author.name || "U")
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground">{author.name || "Anonymous"}</span>
              {author.isVerified && (
                <span className="verified-badge">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {review.course && <span>{review.course}</span>}
              {review.batch && <span>· Batch {review.batch}</span>}
              <span>· {formatRelativeTime(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Overall rating */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 star-filled" />
            <span className="font-bold text-sm">{review.overallRating?.toFixed(1)}</span>
          </div>
          <button
            onClick={() => setShowRatings(!showRatings)}
            className="text-[10px] text-primary hover:underline"
          >
            {showRatings ? "Hide" : "View"} breakdown
          </button>
        </div>
      </div>

      {/* Rating Breakdown */}
      {showRatings && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-muted/40 dark:bg-slate-800/40 rounded-xl animate-slide-down">
          {RATING_LABELS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
              <StarRating value={review.ratings?.[key] || 0} />
            </div>
          ))}
        </div>
      )}

      {/* Review Text */}
      <div className="space-y-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">👍 Pros</span>
          <p className="text-sm text-foreground mt-1 leading-relaxed">{review.pros}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">👎 Cons</span>
          <p className="text-sm text-foreground mt-1 leading-relaxed">{review.cons}</p>
        </div>
        {review.advice && (
          <div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">💡 Advice</span>
            <p className="text-sm text-foreground mt-1 leading-relaxed">{review.advice}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
            hasVoted
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ThumbsUp className={cn("w-3.5 h-3.5", hasVoted && "fill-primary")} />
          Helpful ({helpfulCount})
        </button>
        <button
          onClick={handleFlag}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Flag className="w-3 h-3" />
          Report
        </button>
      </div>
    </div>
  );
}
