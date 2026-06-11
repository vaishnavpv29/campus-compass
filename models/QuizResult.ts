import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResult extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId: string;
  answers: {
    location: string[];
    budget: string;
    stream: string;
    collegeType: string;
    careerGoal: string;
    priorities: string[];
    entranceExam: string;
    campusSize: string;
  };
  matchedColleges: {
    college: mongoose.Types.ObjectId;
    matchPercentage: number;
  }[];
  createdAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, required: true },
    answers: {
      location: [{ type: String }],
      budget: { type: String },
      stream: { type: String },
      collegeType: { type: String },
      careerGoal: { type: String },
      priorities: [{ type: String }],
      entranceExam: { type: String },
      campusSize: { type: String },
    },
    matchedColleges: [
      {
        college: { type: Schema.Types.ObjectId, ref: "College" },
        matchPercentage: { type: Number, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

QuizResultSchema.index({ user: 1 });
QuizResultSchema.index({ sessionId: 1 });

const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult ||
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
