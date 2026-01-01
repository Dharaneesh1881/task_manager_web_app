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


export async function login(req,res){
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"all fields are required"});
    }
    
    try{
        const user =await usermodel.findOne({email:email});
        if(!user){
            return res.status(400).json({success:false,message:"user does not exist"});
        }

        const match =await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({success:false,message:"invalid password"});
        }
        const token = createtoken(user._id);
        
        res.status(200).json({success:true,message:"login successful",token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
            }
        });
    }
    catch(err){
        console.error("error in login",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function getcurrentuser(req,res){
    const user = req.user;
    if(!user){
        return res.status(400).json({success:false,message:"user not found"});
    }
    res.status(200).json({success:true,message:"user found",user});
}

export async function updateuser(req,res){
    const userId = req.user.id;
    const {name,email} = req.body;
    
    if(!name || !email){
        return res.status(400).json({success:false,message:"all fields are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"please provide a valid email"});
    }

    try{
        const exist = await usermodel.findOne({email:email});
        if(exist){
            return res.status(400).json({success:false,message:"Email already in use by another user"});
        }
        const user = await usermodel.findByIdAndUpdate(userId,
            {name,email},
            {new:true , runValidators:true, select:"name email"} 
        );
        res.status(200).json({success:true,message:"user updated successfully",user});
    }
    catch(err){
        console.error("error in update user",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function updatepassword(req,res){
    const userId = req.user.id;
    const {oldpassword,newpassword} = req.body;

    if(!oldpassword || !newpassword){
        return res.status(400).json({success:false,message:"all fields are required"});
    }
    if(newpassword.length < 6){
        return res.status(400).json({success:false,message:"new password must be at least 6 characters"});
    }

    try{
        const user = await usermodel.findById(userId).select("password");
        const match = await bcrypt.compare(oldpassword,user.password);
        if(!match){
            return res.status(400).json({success:false,message:"old password is incorrect"});
        }
        const hashedPassword = await bcrypt.hash(newpassword,5);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({success:true,message:"password updated successfully"});
    }
    catch(err){
        console.error("error in update password",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}