import taskmodel from "../models/taskmodel";

export async function createtask(req,res){
    const {title,description,priority,status,dueDate} = req.body;
    if(!title){
        return res.status(400).json({success:false,message:"title is required"});
    }
    try{
        const task = new taskmodel({
            title,
            description,
            priority,
            status,
            dueDate,
            user:req.user.id
        });
        await task.save();
        res.status(201).json({success:true,message:"task created successfully",task});
    }
    catch(err){
        console.error("error in createtask",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function gettasks(req,res){
    try{
        const tasks = await taskmodel.find({user:req.user.id}).sort({createdAt:-1});
        res.status(200).json({success:true,message:"tasks fetched successfully",tasks});
    }
    catch(err){
        console.error("error in gettasks",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function gettaskbyid(req,res){
    const taskId = req.params.id;
    const userId = req.user.id;
    try{
        const task = await taskmodel.findOne({_id:taskId,user:userId});
        if(!task){
            return res.status(404).json({success:false,message:"task not found"});
        }
        res.status(200).json({success:true,message:"task fetched successfully",task});
    }
    catch(err){
        console.error("error in gettaskbyid",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function updatetask(req,res){
    const taskId = req.params.id;
    const userId = req.user.id;
    const {title,description,priority,status,dueDate} = req.body;
    try{
        let task = await taskmodel.findOne({_id:taskId,user:userId});
        if(!task){
            return res.status(404).json({success:false,message:"task not found"});
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.status(200).json({success:true,message:"task updated successfully",task});
    }
    catch(err){
        console.error("error in updatetask",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}

export async function deletetask(req,res){
    const taskId = req.params.id;
    const userId = req.user.id;
    try{
        const task = await taskmodel.findOneAndDelete({_id:taskId,user:userId});
        if(!task){
            return res.status(404).json({success:false,message:"task not found"});
        }
        res.status(200).json({success:true,message:"task deleted successfully"});
    }
    catch(err){
        console.error("error in deletetask",err.message);
        res.status(500).json({success:false,message:"server error"});
    }
}