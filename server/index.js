import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/ContactsRoutes.js";

dotenv.config();

const app = express();
const port = process.env.port || 6000;
const databaseURL =process.env.DATABASE_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads/profiles")));

app.use(cookieParser());
app.use(express.json()); 


app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes);


const server = app.listen(port, () => {
  console.log(`Server is running on port http//localhost:${port}`);
});

mongoose
.connect(databaseURL)
.then(console.log("successfully connected"))
.then((error)=>{error.message});