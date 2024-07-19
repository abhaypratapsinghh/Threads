import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js"
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (receipientId) => {
  return userSoketMap[receipientId];
};

const userSoketMap = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  const userId = socket.handshake.query.userId;


  if (userId !== "undefined") {
    userSoketMap[userId] = socket.id;
  }

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
      await Conversation.updateOne(
        { _id: conversationId },
        {
          $set: {
            "lastMessage.seen": true,
          },
        }
      );
      io.to(userSoketMap[userId]).emit("messagesSeen", { conversationId });
    }
    catch (err) {
      console.log(err);
      
    }
  });


  io.emit("getOnlineUsers", Object.keys(userSoketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userSoketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSoketMap));
  });
});

export { io, server, app };
