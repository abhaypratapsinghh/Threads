import express from "express";
import {
  signupUser,
  signinUser,
  logoutUser,
  followUnfollowUser,
    updateUser,
  profileUser
} from "../controller/userController.js";

import { protectRoutes } from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/profile/:uName", profileUser);
router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/logout", logoutUser);
router.post("/follow/:uId", protectRoutes, followUnfollowUser);
router.post("/update/:uId", protectRoutes, updateUser);

export default router;
