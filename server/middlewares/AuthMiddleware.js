import jwt from "jsonwebtoken";

export const verifyToken = async(req,res,next)=>{
    
    const token = req.cookies.jwt;
    console.log("JWT Token:", token); // Add logging
    if(!token){
        return res.status(401).send("You are not authenticated!")
    }
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
        if(err) return res.status(403).send("Token is not valid")
        req.userId = payload.data.userId;
        console.log("Payload:", payload); // Add logging
        next();
    });
};