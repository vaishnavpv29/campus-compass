import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "student" | "insider" | "admin";
  bio?: string;
  college?: mongoose.Types.ObjectId;
  course?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  expertise?: string[];
  isVerified: boolean;
  isApproved: boolean;
  wishlist: mongoose.Types.ObjectId[];
  availabilitySlots: {
    day: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }[];
  rating: number;
  reviewCount: number;
  sessionCount: number;
  linkedIn?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySlotSchema = new Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "insider", "admin"],
      default: "student",
    },
    bio: { type: String, maxlength: 500 },
    college: { type: Schema.Types.ObjectId, ref: "College" },
    course: { type: String },
    yearOfStudy: { type: Number, min: 1, max: 6 },
    graduationYear: { type: Number },
    expertise: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "College" }],
    availabilitySlots: [AvailabilitySlotSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sessionCount: { type: Number, default: 0 },
    linkedIn: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ college: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
