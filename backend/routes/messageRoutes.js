import express from "express";

const router = express.Router();

import { protectRoutes } from "../middlewares/protectRoutes.js";
import { getConversations, getMessages, sendMessage } from "../controller/messageController.js";

router.post("/", protectRoutes, sendMessage);
router.get("/get-messages/:uId", protectRoutes, getMessages);
router.get("/get-conversations", protectRoutes, getConversations);

export default router;
