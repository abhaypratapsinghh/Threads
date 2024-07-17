import React, { useEffect, useState } from "react";
import axios from "axios";

import NavBar from "../components/NavBar";
import messageSound from "../assets/sounds/message.mp3";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import ConversationSkeletons from "../components/ConversationSkeletons";
import SearchedConversation from "../components/SearchedConversation";


import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { MdPersonSearch } from "react-icons/md";
import { Oval } from "react-loader-spinner";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  ConversationAtom,
  searchedConversationAtom,
  selectedConversationAtom,
} from "../../atom/ConversationAtom";
import { UserAtom } from "../../atom/UserAtom";

import { useSocket } from "../../context/SocketContext";

import useToastify from "../../hooks/Toast";

const ChatPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [conversations, setConversations] = useRecoilState(ConversationAtom);

  const [searchedConversations, setSearchConversations] = useRecoilState(
    searchedConversationAtom
  );

  const selectedConversation = useRecoilValue(selectedConversationAtom);

  const currentUser = useRecoilValue(UserAtom);

  const { socket, onlineUsers } = useSocket();

  const showToast = useToastify();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setSearchConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });

        return updatedConversation;
      });
      setConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });

        return updatedConversation;
      });
    });
  }, [socket, setConversations]);


  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversationId !== selectedConversation._id) {
        const sound = new Audio(messageSound);
        sound.play();
      }

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

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, setConversations, selectedConversation]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        setSearchText("");
        const response = await axios({
          method: "get",
          url: "/api/v1/messages/get-conversations",
          withCredentials: true,
        });

        if (response.data.error) {
          
          showToast("Error", "error");
        }
        setConversations(response.data);
      } catch (e) {
        showToast("Error");
        console.log(e);
      }
    };

    getConversations();
    setLoadingConversation(false);
  }, []);

  const searchHandler = async (e) => {
    e.preventDefault();

    if (searchLoading) {
      return;
    }
    setSearchLoading(true);
    setSearchMode(true);

    try {
      let sId = searchText;
      if (sId === "") {
        setSearchLoading(false);
        setSearchMode(false);
        return;
      }

      const response = await axios({
        method: "get",
        url: `/api/v1/user/profile/${sId}`,
        withCredentials: true,
      });

      if (response) {
        let allSearchResults = [];
        let cnt = 1;
        response.data.user.map((searchedUser) => {
          if (searchedUser._id !== currentUser._id) {
            let flag = 0;
            conversations.map((conversation) => {
              if (searchedUser._id == conversation.participants[0]._id) {
                allSearchResults.push(conversation);
                flag = 1;
              }
            });
            if (flag == 0) {
              const mockConversation = {
                mock: true,
                lastMessage: {
                  text: "",
                  sender: "",
                  seen: "false",
                },
                _id: Date.now() + cnt++,
                participants: [
                  {
                    _id: searchedUser._id,
                    name: searchedUser.name,
                    profilePic: searchedUser.profilePic,
                  },
                ],
              };

              allSearchResults.push(mockConversation);
            }
          }
        });
        setSearchConversations(allSearchResults);
      }
    } catch (err) {
      showToast("Error", "error");
      console.log(err);
    }
    setSearchLoading(false);
  };

  

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div
        className="w-screen sm:max-w-screen-sm lg:max-w-screen-lg bg-white p-2 rounded-lg 
      shadow-md font-serif flex flex-col max-h-screen"
      >
        <NavBar ind={4} />
        <div
          className={`flex my-2 gap-4 overflow-y-auto custom-scrollbar h-full max-h-full`}
        >
          <div
            className={`${
              selectedConversation.userId ? `hidden` : `flex`
            } w-full lg:w-7/12 border rounded-md lg:flex flex-col gap-2 max-h-full custom-scrollbar`}
          >
            <h1 className="text-2xl font-semibold p-2 text-gray-700">
              Your Conversations
            </h1>
            <form className="flex " onSubmit={(e) => searchHandler(e)}>
              <input
                className="p-2 m-1 text-xl border rounded-lg focus:outline-none w-full"
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  if (e.target.value === "") {
                    setSearchMode(false);
                  }
                }}
              />
              <button
                className="border  px-4  rounded-lg bg-gray-700 text-white text-lg
               hover:bg-gray-500"
              >
                {searchLoading ? (
                  <Oval height={24} width={24} color="black" />
                ) : (
                  <MdPersonSearch size={32} />
                )}
              </button>
            </form>

            <div
              className={`flex flex-col overflow-y-auto max-h-full custom-scrollbar w-full `}
            >
              {loadingConversation ||
                (searchLoading &&
                  [...Array(4)].map((_, i) => (
                    <ConversationSkeletons key={i} />
                  )))}
              {!loadingConversation &&
                !searchMode &&
                conversations?.map((_, i) => (
                  <Conversation
                    key={i}
                    ind={i}
                    isOnline={onlineUsers.includes(_.participants[0]._id)}
                  />
                ))}
              {!loadingConversation &&
                searchMode &&
                searchedConversations?.map((_, i) => (
                  <SearchedConversation
                    key={i}
                    ind={i}
                    isOnline={onlineUsers.includes(_.participants[0]._id)}
                  />
                ))}
            </div>
          </div>

          {!selectedConversation.userId && (
            <div
              className={`w-full border rounded-md hidden lg:flex flex-col justify-center items-center 
              max-h-full`}
            >
              <div>
                <HiOutlineChatBubbleLeftRight size={300} />
                <p className="text-2xl">
                  Select a Conversation to start messaging
                </p>
              </div>
            </div>
          )}

          {selectedConversation.userId && (
            <div
              className={`w-full ${
                selectedConversation.userId ? "flex" : "hidden"
              } lg:flex flex-col overflow-y-auto max-h-full custom-scrollbar`}
            >
              <MessageContainer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
