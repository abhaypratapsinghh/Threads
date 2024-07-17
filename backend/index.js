import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser";
import mainRoute from "./routes/mainRoute.js"
import { v2 as cloudinary } from "cloudinary"
import {app,server} from "./socket/soket.js"



dotenv.config();
connectDB();

const PORT = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



app.use(express.json({limit:'50mb'}))

app.use(express.urlencoded({limit:'50mb', extended: true })); 

app.use(cookieParser());


app.use("/api/v1", mainRoute);





server.listen(PORT, () => console.log(`{server listening on port ${PORT}}`));