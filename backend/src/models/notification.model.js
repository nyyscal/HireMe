// models/Notification.js
import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "application_received",   // client: a teacher applied to your post
        "application_accepted",   // teacher: your application was accepted
        "application_rejected",   // teacher: your application was rejected
        "post_approved",          // client: your post was approved by admin
        "post_rejected",          // client: your post was rejected by admin
        "review_received",        // teacher: a client left you a review
        "new_follower",           // teacher: someone followed you
      ],
      required: true,
    },
    // Generic reference — could point to Post, Application, Review, etc.
    refId:   { type: mongoose.Schema.Types.ObjectId },
    refModel: {
      type: String,
      enum: ["Post", "Application", "Review", "User"],
    },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Fast unread count per user
notificationSchema.index({ userId: 1, isRead: 1 })

export const Notification = mongoose.model("Notification", notificationSchema)