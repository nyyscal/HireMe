import { Webhook } from "svix";
import { User } from "../models/user.model.js";
import { connectDB } from "../config/db.js";

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Missing CLERK_WEBHOOK_SECRET" });
  }

  // Verify the webhook signature
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let payload;

  try {
    payload = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  const { type, data } = payload;

  try {
    await connectDB();

    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = data;

      await User.create({
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url || "",
        addresses: [],
        wishlist: [],
      });

      console.log("✅ User created in DB:", email_addresses?.[0]?.email_address);
    }

    if (type === "user.deleted") {
      const { id } = data;
      await User.deleteOne({ clerkId: id });
      console.log("✅ User deleted from DB:", id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};