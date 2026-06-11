import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Meeting from "@/models/Meeting";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { action, meetLink, cancelReason } = await req.json();
    await dbConnect();

    const meeting = await Meeting.findById(params.id)
      .populate("student", "name")
      .populate("insider", "name");

    if (!meeting) return NextResponse.json({ message: "Meeting not found" }, { status: 404 });

    const isInsider = meeting.insider._id?.toString() === session.user.id || 
                      (meeting.insider as any).toString() === session.user.id;
    const isStudent = meeting.student._id?.toString() === session.user.id ||
                      (meeting.student as any).toString() === session.user.id;

    if (action === "accept" && isInsider) {
      meeting.status = "accepted";
      if (meetLink) meeting.meetLink = meetLink;
      await meeting.save();

      // Notify student
      await Notification.create({
        user: (meeting.student as any)._id,
        type: "meeting_accepted",
        title: "Meeting Accepted! 🎉",
        message: `${(meeting.insider as any).name} accepted your meeting request.`,
        link: `/meetings/${params.id}`,
      });
    } else if (action === "decline" && isInsider) {
      meeting.status = "declined";
      if (cancelReason) meeting.cancelReason = cancelReason;
      await meeting.save();

      await Notification.create({
        user: (meeting.student as any)._id,
        type: "meeting_declined",
        title: "Meeting Declined",
        message: `${(meeting.insider as any).name} declined your meeting request.${cancelReason ? ` Reason: ${cancelReason}` : ""}`,
        link: `/meetings`,
      });
    } else if (action === "cancel" && (isStudent || isInsider)) {
      meeting.status = "cancelled";
      if (cancelReason) meeting.cancelReason = cancelReason;
      await meeting.save();
    } else if (action === "complete" && (isInsider || session.user.role === "admin")) {
      meeting.status = "completed";
      await meeting.save();

      // Update insider session count
      await User.findByIdAndUpdate((meeting.insider as any)._id || meeting.insider, {
        $inc: { sessionCount: 1 },
      });
    } else if (action === "rate" && isStudent && meeting.status === "completed") {
      const { rating, feedback } = await req.json();
      meeting.studentRating = rating;
      meeting.studentFeedback = feedback;
      await meeting.save();

      // Update insider rating
      const insiderId = (meeting.insider as any)._id || meeting.insider;
      const completedMeetings = await Meeting.find({
        insider: insiderId,
        status: "completed",
        studentRating: { $exists: true },
      });
      if (completedMeetings.length > 0) {
        const avgRating =
          completedMeetings.reduce((sum, m) => sum + (m.studentRating || 0), 0) /
          completedMeetings.length;
        await User.findByIdAndUpdate(insiderId, { rating: Math.round(avgRating * 10) / 10 });
      }
    } else {
      return NextResponse.json({ message: "Invalid action or permission denied" }, { status: 400 });
    }

    return NextResponse.json({ message: "Meeting updated", meeting });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
