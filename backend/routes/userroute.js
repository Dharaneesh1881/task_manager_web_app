import express from "express";
import {
  signup,
  login,
  getcurrentuser,
  updateuser,
  updatepassword,
} from "../controller/usercontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);

router.get("/me",auth,getcurrentuser);
router.put("/changeprofile",auth,updateuser);
router.put("/changepassword",auth,updatepassword);

export default router;
