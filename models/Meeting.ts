import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeeting extends Document {
  student: mongoose.Types.ObjectId;
  insider: mongoose.Types.ObjectId;
  college: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  duration: 15 | 30 | 60;
  type: "1on1" | "group";
  message: string;
  status: "pending" | "accepted" | "declined" | "cancelled" | "completed";
  meetLink?: string;
  studentRating?: number;
  studentFeedback?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    insider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: Schema.Types.ObjectId, ref: "College", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    duration: { type: Number, enum: [15, 30, 60], default: 30 },
    type: { type: String, enum: ["1on1", "group"], default: "1on1" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled", "completed"],
      default: "pending",
    },
    meetLink: { type: String },
    studentRating: { type: Number, min: 1, max: 5 },
    studentFeedback: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

MeetingSchema.index({ student: 1, status: 1 });
MeetingSchema.index({ insider: 1, status: 1 });
MeetingSchema.index({ date: 1 });

const Meeting: Model<IMeeting> =
  mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default Meeting;
