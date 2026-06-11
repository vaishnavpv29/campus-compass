import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import College from "@/models/College";
import Course from "@/models/Course";
import Review from "@/models/Review";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const college = await College.findOne({
      $or: [{ slug: params.id }, { _id: params.id.match(/^[a-f\d]{24}$/i) ? params.id : undefined }],
      isActive: true,
    }).lean();

    if (!college) {
      return NextResponse.json({ message: "College not found" }, { status: 404 });
    }

    // Increment view count
    College.findByIdAndUpdate((college as any)._id, { $inc: { viewCount: 1 } }).exec();

    const [courses, reviews] = await Promise.all([
      Course.find({ college: (college as any)._id, isActive: true }).lean(),
      Review.find({ college: (college as any)._id, isPublished: true, isApproved: true })
        .populate("author", "name image role isVerified")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({ college, courses, reviews });
  } catch (error) {
    console.error("College GET[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await dbConnect();

    const college = await College.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!college) {
      return NextResponse.json({ message: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await College.findByIdAndUpdate(params.id, { isActive: false });
    return NextResponse.json({ message: "College deactivated" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
