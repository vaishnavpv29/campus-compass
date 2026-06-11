"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "helpful", label: "Most Helpful" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

interface ReviewsListProps {
  collegeId: string;
  initialReviews: any[];
  collegeName: string;
}

export default function ReviewsList({ collegeId, initialReviews, collegeName }: ReviewsListProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState("recent");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async (newSort: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?college=${collegeId}&sort=${newSort}`);
      const data = await res.json();
      setReviews(data.reviews);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    fetchReviews(newSort);
  };

  const handleReviewSubmitted = (newReview: any) => {
    setReviews([newReview, ...reviews]);
    setShowForm(false);
    toast.success("Review submitted! 🎉");
  };

  const canReview = session?.user?.role === "insider" || session?.user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground">Student Reviews</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} from verified College Insiders
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            id="reviews-sort"
            className="input-field text-sm py-2 pr-8"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Write Review */}
          {canReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              id="write-review-btn"
              className="btn-primary text-sm py-2 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Write Review
            </button>
          )}
          {!session && (
            <div className="text-xs text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">Sign in</a> as Insider to review
            </div>
          )}
          {session && !canReview && (
            <div className="text-xs text-muted-foreground">Only College Insiders can write reviews</div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          collegeId={collegeId}
          collegeName={collegeName}
          onSubmit={handleReviewSubmitted}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-40 skeleton" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground text-sm">Be the first College Insider to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={session?.user?.id}
              onHelpful={(id, helpful, count) => {
                setReviews(reviews.map((r) =>
                  r._id === id ? { ...r, helpfulVotes: helpful ? [...r.helpfulVotes, session?.user?.id] : r.helpfulVotes.filter((v: string) => v !== session?.user?.id) } : r
                ));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
