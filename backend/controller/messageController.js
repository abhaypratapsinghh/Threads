import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import { getRecipientSocketId } from "../socket/soket.js";
import { io } from "../socket/soket.js";

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ newMessage });
  } catch (err) {
    res.status(500).json({ error: `Failed to send message: ${err.message}` });
  }
};




const getMessages = async (req, res) => {
    try {

        const { uId } = req.params;
        const userId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, uId] }
        })

        if (!conversation) {
            return res.status(404).json({
                message: 'No conversation found',
            })
        }

        const message = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: -1 });

       res.status(200).json(message);


    } catch (err) {
      res.status(401).json({
        error: err.message,
      });
    }
}



const getConversations = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username name profilePic",
    });
      
      conversations.forEach(conversation => {
          conversation.participants=conversation.participants.filter(participant => participant._id.toString() !== userId.toString());
      }
    )

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch conversations: ${err.message}`,
    });
  }
};

export default getConversations;



export { sendMessage ,getMessages,getConversations};