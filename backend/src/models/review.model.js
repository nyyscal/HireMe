// models/Review.js
// A client can only review a teacher if there is an accepted Application between them.
// Enforce this check in the service/controller layer before creating a review.
import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    // The teacher being reviewed
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The client writing the review
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Reference to the accepted application — acts as proof of engagement
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
)

// One review per client per teacher
reviewSchema.index({ teacherId: 1, authorId: 1 }, { unique: true })

export const Review = mongoose.model("Review", reviewSchema)