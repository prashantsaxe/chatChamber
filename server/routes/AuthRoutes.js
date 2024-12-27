import { Router } from "express";
import  {signup,login,getuserinfo,updateprofile, addprofileimage, deleteprofileimage, logout}  from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload =  multer({dest: "uploads/profiles"});

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/get-userInfo", verifyToken ,getuserinfo);
authRoutes.post("/update-profile", verifyToken ,updateprofile);
authRoutes.post("/add-profile-image", verifyToken , upload.single("profile-image"), addprofileimage);
authRoutes.delete("/delete-profile-image", verifyToken , deleteprofileimage);
authRoutes.post("/logout",logout);

export default authRoutes;
 