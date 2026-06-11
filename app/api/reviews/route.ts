import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import College from "@/models/College";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("college");
    const sort = searchParams.get("sort") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    if (!collegeId) {
      return NextResponse.json({ message: "College ID required" }, { status: 400 });
    }

    await dbConnect();

    const sortOptions: any = {
      recent: { createdAt: -1 },
      helpful: { "helpfulVotes.length": -1 },
      highest: { overallRating: -1 },
      lowest: { overallRating: 1 },
    };

    const reviews = await Review.find({
      college: collegeId,
      isPublished: true,
      isApproved: true,
    })
      .populate("author", "name image role isVerified college course")
      .sort(sortOptions[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({
      college: collegeId,
      isPublished: true,
      isApproved: true,
    });

    return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    if (session.user.role !== "insider" && session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Only verified College Insiders can write reviews" },
        { status: 403 }
      );
    }

    const { collegeId, ratings, pros, cons, advice, batch, course } = await req.json();

    if (!collegeId || !ratings || !pros || !cons) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already reviewed this college
    const existingReview = await Review.findOne({
      author: session.user.id,
      college: collegeId,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this college" },
        { status: 409 }
      );
    }

    const review = await Review.create({
      author: session.user.id,
      college: collegeId,
      ratings,
      pros,
      cons,
      advice,
      batch,
      course,
    });

    // Update college avg rating
    const allReviews = await Review.find({
      college: collegeId,
      isPublished: true,
      isApproved: true,
    });

    const count = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.overallRating, 0) / count;
    const breakdown = {
      academics: allReviews.reduce((s, r) => s + r.ratings.academics, 0) / count,
      campusLife: allReviews.reduce((s, r) => s + r.ratings.campusLife, 0) / count,
      placements: allReviews.reduce((s, r) => s + r.ratings.placements, 0) / count,
      facultyQuality: allReviews.reduce((s, r) => s + r.ratings.facultyQuality, 0) / count,
      infrastructure: allReviews.reduce((s, r) => s + r.ratings.infrastructure, 0) / count,
      valueForMoney: allReviews.reduce((s, r) => s + r.ratings.valueForMoney, 0) / count,
    };

    await College.findByIdAndUpdate(collegeId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: count,
      ratingBreakdown: breakdown,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("Review POST error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
