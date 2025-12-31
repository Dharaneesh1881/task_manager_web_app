import usermodel from "../models/usermodel";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRE = "24h";

function createtoken(userId){
    return jwt.sign({id:userId},JWT_SECRET,{expiresIn:TOKEN_EXPIRE});
}



export async function signup(req, res){
    const {name,email,password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success:false,message: "All fileds are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false, message:"please provide a valid email"});
    }
    if(password.length < 6){
        return res.status(400).json({success:false,message:"password must be at least 6 characters"});
    }

    try{
        if (await usermodel.findOne({email:email})){
            return res.status(400).json({success:false, message:"user alredy exists"});
        }

        const hashedPassword = await bcrypt.hash(password,5);
        const user = await usermodel.create({
            name,
            email,
            password:hashedPassword
        })

        const token = createtoken(user._id);

        res.status(201).json({success:true,message:"user created successfully",token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
            }
        });
    }
    catch(err){
        console.error("error in signup",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

