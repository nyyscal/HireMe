// models/Application.js  (teacher applies to a client's post)
import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverNote:    { type: String, maxlength: 500 },
    seenByClient: { type: Boolean, default: false },  // lets teacher know if viewed
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
)

// One application per teacher per post
applicationSchema.index({ postId: 1, teacherId: 1 }, { unique: true })

export const Application = mongoose.model("Application", applicationSchema)