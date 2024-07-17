import React, { useState } from "react";
import { MdSend, MdOutlineAttachFile } from "react-icons/md";
import axios from "axios";
import {
  searchedConversationAtom,
  selectedConversationAtom,
  ConversationAtom,
} from "../../atom/ConversationAtom";
import {  useRecoilValue, useSetRecoilState } from "recoil";

import { Oval } from "react-loader-spinner";

const MessageInput = ({ setMessages }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedConversation = useRecoilValue(selectedConversationAtom);

  const setSearchedConversation = useSetRecoilState(searchedConversationAtom);
  const setConversation = useSetRecoilState(ConversationAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!text) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios({
        method: "post",
        url: `api/v1/messages`,
        withCredentials: true,
        data: {
          message: text,
          recipientId: selectedConversation.userId,
        },
      });

      if (response.data.error) {
        console.error(response.data.error);
      }
      setMessages((message) => [...message, response.data.newMessage]);

      setSearchedConversation((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              mock:false,
              lastMessage: {
                text: text,
                sender: response.data.newMessage.sender,
              },
            };
          } else {
            return conversation;
          }
        });

        return updatedConversations;
      });
      setConversation((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: text,
                sender: response.data.newMessage.sender,
              },
            };
          } else {
            return conversation;
          }
        });

        return updatedConversations;
      });

      setText("");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };


  return (
    <form
      onSubmit={(e) => { handleSendMessage(e)  }}
      className="flex w-full items-center p-1 rounded-full border  shadow-black shadow-2xl mb-3"
    >
      <button>
        <MdOutlineAttachFile size={32} className="mx-2" />
      </button>
      <input
        type="text"
        className="p-2 m-1 rounded-md w-full bg-gray-100 focus-within:outline-none text-2xl font-sans overflow-x-scroll"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="hover:bg-slate-300 rounded-full p-2 flex justify-center">
        {loading ? (
          <Oval height={40} width={40} color="black" secondaryColor="black" />
        ) : (
          <MdSend size={36} className="mx-4" />
        )}
      </button>
    </form>
  );
};

export default MessageInput;
