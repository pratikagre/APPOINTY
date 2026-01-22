import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// ✅ required for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// ✅ API endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// ✅ API test route
app.get("/api", (req, res) => {
  res.send("API Working ✅");
});

/* =========================================================
   ✅ Serve FRONTEND + ADMIN (Single Website Hosting)
   Frontend URL: /
   Admin URL: /admin
   API URL: /api
   ========================================================= */

// ✅ serve admin build
app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));

// ✅ serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ React Router fallback for admin (Express v5 compatible)
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// ✅ React Router fallback for frontend (Express v5 compatible)
// this prevents /api routes from being caught by frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
 import doctorModel from "./models/doctorModel.js";
import bcrypt from "bcrypt";

const seedDoctors = async () => {
  try {
    const count = await doctorModel.countDocuments();
    if (count > 0) return;

    const hashed = await bcrypt.hash("Doctor@123", 10);

    await doctorModel.insertMany([
      {
        name: "Dr. Richard James",
        email: "doc1@gmail.com",
        password: hashed,
        image: "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "4 Years",
        about: "Experienced dermatologist",
        fees: 500,
        address: { line1: "Delhi", line2: "India" },
        available: true,
        date: Date.now(),
      },
      {
        name: "Dr. Emily Larson",
        email: "doc2@gmail.com",
        password: hashed,
        image: "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        about: "Experienced gynecologist",
        fees: 600,
        address: { line1: "Mumbai", line2: "India" },
        available: true,
        date: Date.now(),
      },
      {
        name: "Dr. Christopher Lee",
        email: "doc3@gmail.com",
        password: hashed,
        image: "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
        speciality: "Pediatricians",
        degree: "MBBS",
        experience: "5 Years",
        about: "Experienced pediatrician",
        fees: 400,
        address: { line1: "Pune", line2: "India" },
        available: true,
        date: Date.now(),
      },
    ]);

    console.log("✅ Seed doctors inserted");
  } catch (err) {
    console.log("❌ Seed doctors failed:", err.message);
  }
};


app.listen(port, () => console.log(`Server started on PORT:${port}`));
