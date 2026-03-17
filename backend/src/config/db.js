import mongoose from "mongoose"
import "dotenv/config"
import { ENV } from "./env.js"

const DATABASE_URL = ENV.DB_URL

export const connectDB = async() =>{
  try {
    const conn = await mongoose.connect(DATABASE_URL,{
  })
  console.log(`🌿 MongoDB connected succesfully! ${conn.connection.host}`)
  } catch (error) {
    console.log("❌ Error connecting MongoDB.")
    process.exit(1) //1 means failure, 0 means success!
  }
}