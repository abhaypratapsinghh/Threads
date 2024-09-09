import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser";
import mainRoute from "./routes/mainRoute.js"
import { v2 as cloudinary } from "cloudinary"
import {app,server} from "./socket/soket.js"
import job from "./cron/cron.js";

const __dirname=path.resolve();
dotenv.config();
connectDB();
job.start();

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



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => console.log(`{server listening on port ${PORT}}`));