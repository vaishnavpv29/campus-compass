import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/db";
import College from "@/models/College";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const state = searchParams.get("state") || "";
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || "";
    const stream = searchParams.get("stream") || "";
    const minFee = searchParams.get("minFee");
    const maxFee = searchParams.get("maxFee");
    const minRank = searchParams.get("minRank");
    const maxRank = searchParams.get("maxRank");
    const minRating = searchParams.get("minRating");
    const exam = searchParams.get("exam") || "";
    const sort = searchParams.get("sort") || "ranking";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    await dbConnect();

    const filter: any = { isApproved: true, isActive: true };

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
        { "location.state": { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (state) filter["location.state"] = { $regex: state, $options: "i" };
    if (city) filter["location.city"] = { $regex: city, $options: "i" };
    if (type) filter.type = type;
    if (exam) filter.entranceExams = { $in: [exam] };
    if (minRating) filter.avgRating = { $gte: parseFloat(minRating) };

    if (minRank || maxRank) {
      filter.nirfRanking = {};
      if (minRank) filter.nirfRanking.$gte = parseInt(minRank);
      if (maxRank) filter.nirfRanking.$lte = parseInt(maxRank);
    }

    // Sort
    const sortOptions: any = {
      ranking: { nirfRanking: 1 },
      rating: { avgRating: -1 },
      fees_asc: { averagePackage: 1 },
      popularity: { viewCount: -1 },
      newest: { createdAt: -1 },
    };

    const total = await College.countDocuments(filter);
    const colleges = await College.find(filter)
      .sort(sortOptions[sort] || { nirfRanking: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "name slug logo bannerImage location type nirfRanking naacGrade avgRating totalReviews averagePackage highestPackage placementPercentage entranceExams totalStudents"
      )
      .lean();

    return NextResponse.json({
      colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Colleges GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const college = await College.create(body);
    return NextResponse.json(college, { status: 201 });
  } catch (error: any) {
    console.error("College POST error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
