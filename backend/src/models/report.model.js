// models/Report.js
// Users report spam posts or bad-actor teachers/clients to admin.
import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    refModel: {
      type: String,
      enum: ["Post", "User"],
      required: true,
    },
    reason: {
      type: String,
      enum: ["spam", "inappropriate", "fake", "harassment", "other"],
      required: true,
    },
    details: { type: String, maxlength: 500, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // admin
      default: null,
    },
  },
  { timestamps: true }
)

// Admin dashboard: filter pending reports
reportSchema.index({ status: 1, refModel: 1 })

export const Report = mongoose.model("Report", reportSchema)