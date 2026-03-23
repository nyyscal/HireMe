// models/User.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    clerkId:  { type: String, unique: true, required: true },
    email:    { type: String, unique: true, required: true },
    name:     { type: String, required: true },
    phone:    { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    role: {
      type: String,
      enum: ["client", "teacher", "admin"],
      default: "client",
      required: true,
    },
    // Soft ban by admin
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const User = mongoose.model("User", userSchema)