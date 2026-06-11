import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Meeting from "@/models/Meeting";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || session.user.role;

    await dbConnect();

    const filter: any =
      role === "insider"
        ? { insider: session.user.id }
        : { student: session.user.id };

    const meetings = await Meeting.find(filter)
      .populate("student", "name email image")
      .populate("insider", "name email image college course")
      .populate("college", "name slug logo")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ meetings });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "student") {
      return NextResponse.json({ message: "Only students can book meetings" }, { status: 403 });
    }

    const { insiderId, collegeId, date, timeSlot, duration, type, message } = await req.json();

    await dbConnect();

    const meeting = await Meeting.create({
      student: session.user.id,
      insider: insiderId,
      college: collegeId,
      date: new Date(date),
      timeSlot,
      duration,
      type,
      message,
    });

    // Create notification for insider
    const student = await User.findById(session.user.id).select("name");
    await Notification.create({
      user: insiderId,
      type: "meeting_request",
      title: "New Meeting Request",
      message: `${student?.name} wants to book a ${duration}-min session with you.`,
      link: `/dashboard/insider/meetings/${meeting._id}`,
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
