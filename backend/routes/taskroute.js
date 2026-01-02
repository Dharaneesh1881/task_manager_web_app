import express from "express";
import auth from "../middleware/auth.js";
import { gettasks, createtask, gettaskbyid, updatetask, deletetask } from "../controller/taskcontroller.js";

const taskrouter = express.Router();

taskrouter.route("/gp")
    .get(auth,gettasks)
    .post(auth,createtask);

taskrouter.route("/gp/:id")
    .get(auth,gettaskbyid)
    .put(auth,updatetask)
    .delete(auth,deletetask);

export default taskrouter;