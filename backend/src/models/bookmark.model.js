// models/Bookmark.js
// Teachers bookmark Posts they're interested in.
// Clients bookmark TeacherProfiles they like.
import mongoose from "mongoose"

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
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
      enum: ["Post", "TeacherProfile"],
      required: true,
    },
  },
  { timestamps: true }
)

// One bookmark per user per item
bookmarkSchema.index({ userId: 1, refId: 1 }, { unique: true })

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema)