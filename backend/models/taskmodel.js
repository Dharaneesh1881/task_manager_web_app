import mongoose from "monfoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""    
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"low"
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending"
    },
    dueDate:{
        type:Date
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const taskmodel = mongoose.model("task",taskSchema);

export default taskmodel;