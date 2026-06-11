import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  college: mongoose.Types.ObjectId;
  ratings: {
    academics: number;
    campusLife: number;
    placements: number;
    facultyQuality: number;
    infrastructure: number;
    valueForMoney: number;
  };
  overallRating: number;
  pros: string;
  cons: string;
  advice: string;
  batch?: string;
  course?: string;
  helpfulVotes: mongoose.Types.ObjectId[];
  isFlagged: boolean;
  flagReason?: string;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: Schema.Types.ObjectId, ref: "College", required: true },
    ratings: {
      academics: { type: Number, required: true, min: 1, max: 5 },
      campusLife: { type: Number, required: true, min: 1, max: 5 },
      placements: { type: Number, required: true, min: 1, max: 5 },
      facultyQuality: { type: Number, required: true, min: 1, max: 5 },
      infrastructure: { type: Number, required: true, min: 1, max: 5 },
      valueForMoney: { type: Number, required: true, min: 1, max: 5 },
    },
    overallRating: { type: Number, min: 0, max: 5 },
    pros: { type: String, required: true, minlength: 20 },
    cons: { type: String, required: true, minlength: 20 },
    advice: { type: String },
    batch: { type: String },
    course: { type: String },
    helpfulVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    isApproved: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-calculate overall rating before saving
ReviewSchema.pre("save", function (next) {
  const r = this.ratings;
  this.overallRating =
    (r.academics + r.campusLife + r.placements + r.facultyQuality + r.infrastructure + r.valueForMoney) / 6;
  next();
});

ReviewSchema.index({ college: 1, createdAt: -1 });
ReviewSchema.index({ author: 1 });
ReviewSchema.index({ isApproved: 1, isPublished: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
