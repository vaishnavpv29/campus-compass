import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollege extends Document {
  _id: any;
  name: string;
  slug: string;
  logo?: string;
  bannerImage?: string;
  gallery?: string[];
  // Overview
  location: {
    city: string;
    state: string;
    address?: string;
    pincode?: string;
    coordinates?: { lat: number; lng: number };
  };
  type: "Private" | "Public" | "Deemed University" | "Autonomous";
  establishedYear: number;
  naacGrade?: string;
  nirfRanking?: number;
  affiliatedUniversity?: string;
  totalStudents?: number;
  officialWebsite?: string;
  description: string;
  // Stats
  averagePackage?: number;
  highestPackage?: number;
  lowestPackage?: number;
  placementPercentage?: number;
  // Facilities
  facilities: {
    hostelBoys: boolean;
    hostelGirls: boolean;
    mess: boolean;
    gym: boolean;
    library: boolean;
    sportsComplex: boolean;
    medicalCenter: boolean;
    wifi: boolean;
  };
  clubs?: string[];
  culturalFests?: string[];
  techFests?: string[];
  // Admission
  entranceExams?: string[];
  applicationDeadline?: string;
  cutoffRanks?: Record<string, number>;
  admissionLink?: string;
  // Recruiters
  topRecruiters?: { name: string; logo?: string }[];
  notableAlumni?: { name: string; designation?: string; company?: string }[];
  // Ratings
  avgRating: number;
  totalReviews: number;
  ratingBreakdown: {
    academics: number;
    campusLife: number;
    placements: number;
    facultyQuality: number;
    infrastructure: number;
    valueForMoney: number;
  };
  // Moderation
  isApproved: boolean;
  isActive: boolean;
  viewCount: number;
  searchCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    bannerImage: { type: String },
    gallery: [{ type: String }],
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    type: {
      type: String,
      enum: ["Private", "Public", "Deemed University", "Autonomous"],
      required: true,
    },
    establishedYear: { type: Number },
    naacGrade: { type: String },
    nirfRanking: { type: Number },
    affiliatedUniversity: { type: String },
    totalStudents: { type: Number },
    officialWebsite: { type: String },
    description: { type: String, required: true },
    averagePackage: { type: Number },
    highestPackage: { type: Number },
    lowestPackage: { type: Number },
    placementPercentage: { type: Number },
    facilities: {
      hostelBoys: { type: Boolean, default: false },
      hostelGirls: { type: Boolean, default: false },
      mess: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      library: { type: Boolean, default: true },
      sportsComplex: { type: Boolean, default: false },
      medicalCenter: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
    },
    clubs: [{ type: String }],
    culturalFests: [{ type: String }],
    techFests: [{ type: String }],
    entranceExams: [{ type: String }],
    applicationDeadline: { type: String },
    cutoffRanks: { type: Map, of: Number },
    admissionLink: { type: String },
    topRecruiters: [
      {
        name: { type: String },
        logo: { type: String },
      },
    ],
    notableAlumni: [
      {
        name: { type: String },
        designation: { type: String },
        company: { type: String },
      },
    ],
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    ratingBreakdown: {
      academics: { type: Number, default: 0 },
      campusLife: { type: Number, default: 0 },
      placements: { type: Number, default: 0 },
      facultyQuality: { type: Number, default: 0 },
      infrastructure: { type: Number, default: 0 },
      valueForMoney: { type: Number, default: 0 },
    },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    searchCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CollegeSchema.index({ name: "text", description: "text" });
CollegeSchema.index({ "location.state": 1 });
CollegeSchema.index({ "location.city": 1 });
CollegeSchema.index({ nirfRanking: 1 });
CollegeSchema.index({ avgRating: -1 });
CollegeSchema.index({ isApproved: 1, isActive: 1 });

const College: Model<ICollege> =
  mongoose.models.College || mongoose.model<ICollege>("College", CollegeSchema);

export default College;
