import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  college: mongoose.Types.ObjectId;
  name: string;
  type: "UG" | "PG" | "PhD" | "Diploma" | "Certificate";
  duration: string;
  eligibility: string;
  annualFee: number;
  totalFee?: number;
  scholarshipAvailable: boolean;
  scholarshipDetails?: string;
  seats?: number;
  specializations?: string[];
  isActive: boolean;
}

const CourseSchema = new Schema<ICourse>(
  {
    college: { type: Schema.Types.ObjectId, ref: "College", required: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["UG", "PG", "PhD", "Diploma", "Certificate"],
      required: true,
    },
    duration: { type: String, required: true },
    eligibility: { type: String, required: true },
    annualFee: { type: Number, required: true },
    totalFee: { type: Number },
    scholarshipAvailable: { type: Boolean, default: false },
    scholarshipDetails: { type: String },
    seats: { type: Number },
    specializations: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CourseSchema.index({ college: 1 });
CourseSchema.index({ type: 1 });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
