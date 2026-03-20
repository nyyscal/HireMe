import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { clerkWebhook } from "./config/webhook.js";
// import { serve } from "inngest/express";
// import { functions, inngest } from "./config/inngest.js";

const app = express();
const PORT = ENV.PORT || 3000;


app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }), // ← important, must be raw
  clerkWebhook
);

app.use(express.json());
// app.use("/api/inngest", serve({ client: inngest, functions }));


app.get("/api/health", (_, res) => {
  res.send("Server is healthy!");
});


app.use(clerkMiddleware());

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🔥 Open http://localhost:" + PORT + "/api/inngest to sync functions");
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();