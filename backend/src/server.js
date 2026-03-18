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
app.use(clerkMiddleware())

app.use("/api/inngest",serve({client: inngest, functions}))
//From docs of inngest

app.get("/api/health",(_,res)=>{
  res.send("Server is healthy!")
})

app.listen(PORT,()=>{
  connectDB()
  console.log(`🚀 Server is running in http://localhost:${PORT}`)
})