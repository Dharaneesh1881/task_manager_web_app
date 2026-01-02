import jwt from "jsonwebtoken";
import usermodel from "../models/usermodel.js";
import "dotenv/config";

export default async function auth(req, res, next) {
    const authheader = req.headers.authorization;
    if(!authheader || !authheader.startsWith("Bearer ")){
        return res.status(401).json({success:false,message:"unauthorized"});
    }
    const token = authheader.split(" ")[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({success:false,message:"unauthorized"});
        }
        req.user = user;
        next();

    }
    catch(err){
        console.error("auth middleware error",err.message);
        return res.status(401).json({success:false,message:"token is invalid or expired "});
    }
}
