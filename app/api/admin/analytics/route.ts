import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import College from "@/models/College";
import User from "@/models/User";
import Review from "@/models/Review";
import Meeting from "@/models/Meeting";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();

    const [
      totalColleges,
      pendingColleges,
      totalUsers,
      totalStudents,
      totalInsiders,
      totalReviews,
      flaggedReviews,
      totalMeetings,
      pendingMeetings,
    ] = await Promise.all([
      College.countDocuments({ isActive: true }),
      College.countDocuments({ isApproved: false, isActive: true }),
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "insider" }),
      Review.countDocuments({ isPublished: true }),
      Review.countDocuments({ isFlagged: true, isPublished: true }),
      Meeting.countDocuments(),
      Meeting.countDocuments({ status: "pending" }),
    ]);

    // Recent signups (last 7 days, grouped by day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSignups = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top colleges by views
    const topColleges = await College.find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(5)
      .select("name slug viewCount avgRating totalReviews")
      .lean();

    // Top insiders by session count
    const topInsiders = await User.find({ role: "insider" })
      .sort({ sessionCount: -1 })
      .limit(5)
      .select("name image rating sessionCount college")
      .populate("college", "name")
      .lean();

    return NextResponse.json({
      stats: {
        totalColleges,
        pendingColleges,
        totalUsers,
        totalStudents,
        totalInsiders,
        totalReviews,
        flaggedReviews,
        totalMeetings,
        pendingMeetings,
      },
      charts: {
        recentSignups,
        topColleges,
        topInsiders,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
