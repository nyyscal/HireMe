// models/Follow.js
// Replaces the embedded followers/following arrays in TeacherProfile.
// Queryable in both directions without document bloat.
import mongoose from "mongoose"

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

// One follow relationship per pair
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true })
// Fast lookup: "who follows this teacher?"
followSchema.index({ followingId: 1 })

export const Follow = mongoose.model("Follow", followSchema)