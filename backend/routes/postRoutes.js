import express from "express";

import {
  createPost,
  getPost,
  deletePost,
  likePost,
  replyPost,
  feedPost,
  userPosts,
  userReplies,
} from "../controller/postController.js";
import { protectRoutes } from "../middlewares/protectRoutes.js";

const router = express.Router();

router.post("/create", protectRoutes, createPost);
router.get("/get-post/:pId", getPost);
router.delete("/delete-post/:pId", protectRoutes, deletePost);
router.post("/like/:pId", protectRoutes, likePost);
router.post("/reply/:pId", protectRoutes, replyPost);
router.get("/feed", feedPost);
router.get("/userposts/:uId", userPosts);
router.get("/user-replies/:uId",userReplies);

export default router;
