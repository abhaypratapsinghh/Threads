import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { MdVerified } from "react-icons/md";

import Chats from "./Chat";
import ChatsSkeleton from "./ChatSkeleton";
import MessageInput from "./MessageInput";
import { BsArrowBarLeft } from "react-icons/bs";

import {
  ConversationAtom,
  selectedConversationAtom,
} from "../../atom/ConversationAtom";
import { UserAtom } from "../../atom/UserAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useSocket } from "../../context/SocketContext";

import useToastify from "../../hooks/Toast";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const { socket } = useSocket();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(ConversationAtom);
  const currentUser = useRecoilValue(UserAtom);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (selectedConversation._id === message.conversationId)
        setMessages((prevMessages) => [...prevMessages, message]);

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });

        return updatedConversations;
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, setConversations, selectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      if (selectedConversation.mock) {
        setLoading(false);
        setMessages([]);
        return;
      }
      try {
        const response = await axios({
          method: "get",
          url: `/api/v1/messages/get-messages/${selectedConversation.userId}`,
          withCredentials: true,
        });

        if (response) {
          setMessages(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages, selectedConversation.mock]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation, messages]);

  const handleNavigateBack = () => {
    setSelectedConversation({
      id: "",
      userId: "",
      name: "",
      username: "",
      userProfilePic: "",
    });
  };

  return (
    <div className="w-full min-h-full bg-gray-100 flex flex-col justify-between">
      <div className="flex m-1 p-2 border rounded-md bg-gray-300 gap-2 items-center">
        {selectedConversation && (
          <button
            className="rounded-lg p-2  hover:bg-gray-400 "
            onClick={handleNavigateBack}
          >
            <BsArrowBarLeft size={36} />
          </button>
        )}
        <div className="relative flex flex-col items-end">
          <img
            src={selectedConversation.userProfilePic || "/img1.webp"}
            className={`size-16 rounded-full`}
          />
        </div>

        <div className="flex w-full px-2 gap-1 ">
          <div className="flex items-center text-lg">
            {selectedConversation.name.charAt(0).toUpperCase() +
              selectedConversation.name.slice(1)}
            <MdVerified color="blue" />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-4 my-4 overflow-y-auto custom-scrollbar"
        ref={scrollRef}
      >
        {loading && (
          <>
            <ChatsSkeleton self={true} />
            <ChatsSkeleton self={false} />
            <ChatsSkeleton self={true} />
            <ChatsSkeleton self={false} />
          </>
        )}
        {!loading &&
          messages?.map((message, ind) => (
            <Chats
              message={message.text}
              self={currentUser._id === message.sender}
              key={ind}
              seen={message.seen}
            />
          ))}
      </div>
      <MessageInput setMessages={setMessages} />
    </div>
  );
};

export default MessageContainer;
