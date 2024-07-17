import express from "express";
import userRoutes from "./userRoutes.js"
import postRoutes from "./postRoutes.js" 
import messageRoutes from "./messageRoutes.js"

const router = express.Router();
 
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/messages", messageRoutes);


export default router;
