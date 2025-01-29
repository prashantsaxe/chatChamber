import { Router } from "express";
import { signup, login, getuserinfo, updateprofile, addprofileimage, deleteprofileimage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload from "../multerConfig.js"; // Use Cloudinary storage

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/get-userInfo", verifyToken, getuserinfo);
authRoutes.post("/update-profile", verifyToken, updateprofile);
authRoutes.post("/add-profile-image", verifyToken, addprofileimage);
authRoutes.delete("/delete-profile-image", verifyToken, deleteprofileimage);
authRoutes.post("/logout", logout);

export default authRoutes;
