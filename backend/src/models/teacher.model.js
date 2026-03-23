// models/TeacherProfile.js
import mongoose from "mongoose"
import { SUBJECTS } from "../constants/subjects.js"

const teacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio:            { type: String, maxlength: 1000 },
    contact:        { type: String, required: true },
    subjects:       [{ type: String, enum: SUBJECTS }],
    location:       { type: String, default: "" },         // e.g. "Kathmandu, Baneshwor"
    experience:     { type: Number, default: 0 },          // years of experience
    educationLevel: { type: String, default: "" },         // e.g. "Masters in Mathematics"
    availability:   { type: String, default: "" },         // e.g. "Weekdays evening"
    hourlyRate:     { type: Number, default: 0 },          // expected rate in NPR
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    // Computed from Reviews — kept denormalized for query performance
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:  { type: Number, default: 0 },

    // Verification badge granted by admin
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const TeacherProfile = mongoose.model("TeacherProfile", teacherProfileSchema)