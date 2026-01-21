import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from "path"
import { fileURLToPath } from "url"

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000

// ✅ required for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to database
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// ✅ API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)

// ✅ test route
app.get("/api", (req, res) => {
  res.send("API Working ✅")
})

/* =========================================================
   ✅ Serve FRONTEND + ADMIN (Single Website Hosting)
   Frontend URL: /
   Admin URL: /admin
   ========================================================= */

// ✅ Serve Admin build
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")))

// ✅ Serve Frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")))

// ✅ React Router fallback for admin
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"))
})

// ✅ React Router fallback for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

app.listen(port, () => console.log(`Server started on PORT:${port}`))
