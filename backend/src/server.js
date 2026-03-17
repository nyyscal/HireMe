import express from "express"
import "dotenv/config"

const app = express()

const PORT = process.env.PORT

app.get("/api/health",(_,res)=>{
  res.send("Server is healthy!")
})

app.listen(PORT,()=>{
  console.log(`Server is running in http://localhost:${PORT}`)
})