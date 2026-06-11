import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const college = searchParams.get("college");
    const course = searchParams.get("course");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    await dbConnect();

    const filter: any = { role: "insider", isApproved: true };
    if (college) filter.college = college;
    if (course) filter.course = { $regex: course, $options: "i" };

    const total = await User.countDocuments(filter);
    const insiders = await User.find(filter)
      .populate("college", "name slug logo location")
      .select("name image bio college course yearOfStudy graduationYear expertise rating sessionCount isVerified availabilitySlots")
      .sort({ rating: -1, sessionCount: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ insiders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
