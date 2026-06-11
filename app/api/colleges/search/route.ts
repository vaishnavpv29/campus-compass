import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import dbConnect from "@/lib/db";
import College from "@/models/College";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();

    const results = await College.find({
      isApproved: true,
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
      ],
    })
      .select("name slug location type nirfRanking logo avgRating")
      .limit(8)
      .lean();

    // Increment search count
    const ids = results.map((r: any) => r._id);
    if (ids.length > 0) {
      College.updateMany({ _id: { $in: ids } }, { $inc: { searchCount: 1 } }).exec();
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
