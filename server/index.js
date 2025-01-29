import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoute.js";

dotenv.config();

const app = express();
const port = process.env.port || 6000;
const databaseURL =process.env.DATABASE_URL;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const allowedOrigins = [
  process.env.ORIGIN,
  "https://chat-chamber.vercel.app/"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads/profiles")));
// app.use("/uploads/files", express.static(path.join(__dirname, "uploads/files")));

app.use(cookieParser());
app.use(express.json()); 


app.use("/api/auth",authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messagesRoutes);
app.use("/api/channel",channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port http//localhost:${port}`);
});

setupSocket(server);

mongoose
.connect(databaseURL)
.then(console.log("successfully connected"))
.then((error)=>{error.message});