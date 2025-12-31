import express  from "express";
import mongoose from "mongoose";

export const connectDB =async () => {
    try{
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"));
    }
    catch(err){
        console.error('error in connecting to mongodb',err.message);
    }
}
