import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { action, reason } = await req.json();
    await dbConnect();

    const review = await Review.findById(params.id);
    if (!review) return NextResponse.json({ message: "Review not found" }, { status: 404 });

    // Helpful vote toggle
    if (action === "helpful") {
      const userId = session.user.id;
      const hasVoted = review.helpfulVotes.some((v) => v.toString() === userId);
      if (hasVoted) {
        review.helpfulVotes = review.helpfulVotes.filter((v) => v.toString() !== userId);
      } else {
        review.helpfulVotes.push(userId as any);
      }
      await review.save();
      return NextResponse.json({ helpful: !hasVoted, count: review.helpfulVotes.length });
    }

    // Flag review
    if (action === "flag") {
      review.isFlagged = true;
      review.flagReason = reason;
      await review.save();
      return NextResponse.json({ message: "Review flagged" });
    }

    // Admin: approve/reject
    if (session.user.role === "admin") {
      if (action === "approve") {
        review.isApproved = true;
        review.isFlagged = false;
      } else if (action === "reject") {
        review.isPublished = false;
        review.isApproved = false;
      }
      await review.save();
      return NextResponse.json({ message: `Review ${action}d` });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const review = await Review.findById(params.id);
    if (!review) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Only author or admin can delete
    if (review.author.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await review.deleteOne();
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
