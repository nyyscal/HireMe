// models/Post.js  (tuition vacancy posted by a client)
import mongoose from "mongoose"
import { SUBJECTS } from "../constants/subjects.js"

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    subjects:     [{ type: String, enum: SUBJECTS, required: true }],
    salary:       { type: Number, required: true, min: 0 },
    gradeLevel:   { type: String, default: "" },           // e.g. "Grade 8-10", "A-Levels"
    studentCount: { type: Number, default: 1, min: 1 },    // 1-on-1 vs group
    location: {
      address: { type: String, required: true },
      coordinates: {                                       // optional — enables geo queries
        type:        { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },                   // [lng, lat]
      },
    },
    time:    { type: String, required: true },             // e.g. "Mon-Fri 4pm"
    contact: { type: String, required: true },
    email:   { type: String, required: true },
    images:  [{ type: String }],

    // Soft close once a teacher is hired
    isActive: { type: Boolean, default: true },
    hiredTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin approval workflow
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
)

// Efficient queries: approved + active posts filtered by subject
postSchema.index({ approvalStatus: 1, isActive: 1, subjects: 1 })
// Geo query support (only active if coordinates are provided)
postSchema.index({ "location.coordinates": "2dsphere" }, { sparse: true })

export const Post = mongoose.model("Post", postSchema)