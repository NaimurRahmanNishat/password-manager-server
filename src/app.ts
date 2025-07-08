import express, { Application } from 'express';
import bodyParser from 'body-parser';
const app: Application = express();
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const port: number = 8000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://password-manager-client-ruby.vercel.app"],
  credentials: true,
}));


// ✅ auth routes
import authRoutes from "./users/user.route";
app.use("/api/auth", authRoutes);

// ✅ document routes
import documentRoutes from "./document/document.route";
app.use("/api/document", documentRoutes);


// ✅ database connection
async function bootstrap() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("❌ No MongoDB URL found in environment variables.");
      process.exit(1);
    }
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB Connected!");
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!", error);
  }
}

bootstrap();