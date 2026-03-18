import express from "express"
import "dotenv/config"
import { connectDB } from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import { ENV } from "./config/env.js"
import {serve} from "inngest/express"
import {functions, inngest} from "./config/inngest.js"
const app = express()

const PORT = ENV.PORT

app.use(express.json())

//From docs of inngest
app.use("/api/inngest",serve({client: inngest, functions}))

app.use(clerkMiddleware())


app.get("/api/health",(_,res)=>{
  res.send("Server is healthy!")
  // console.log(process.env.INNGEST_SIGNING_KEY)
})

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();