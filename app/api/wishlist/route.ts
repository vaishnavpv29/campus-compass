import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id)
      .populate("wishlist", "name slug logo avgRating location type nirfRanking averagePackage")
      .select("wishlist")
      .lean();

    return NextResponse.json({ wishlist: (user as any)?.wishlist || [] });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { collegeId } = await req.json();
    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { wishlist: collegeId },
    });

    return NextResponse.json({ message: "Added to wishlist" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { collegeId } = await req.json();
    await dbConnect();

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { wishlist: collegeId },
    });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
