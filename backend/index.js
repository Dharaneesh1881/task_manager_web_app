import express from "express";
import cors from "cors";
import "dotenv/config";
import {connectDB} from "../config/db.js";
import router from "../routes/userroute.js";



const app = express();
const port = process.env.PORT || 4000


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use("/api/users",router);

app.get("/",(req,res) => {
    res.send("API is running...");
})



app.listen(port , () => {
    console.log('server is running http://localhost:' + port);
})