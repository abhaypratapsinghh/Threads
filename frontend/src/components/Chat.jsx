import React from "react";
import { selectedConversationAtom } from "../../atom/ConversationAtom";
import { UserAtom } from "../../atom/UserAtom";

import { useRecoilValue } from "recoil";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
const Chats = ({ message, self,seen}) => {

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  
  const currentUser = useRecoilValue(UserAtom);

  
  return (
    <div className={`flex ${self ? "justify-end" : ""}`}>
      <div className="">
        <div
          className={`flex ${
            self ? "flex-row-reverse" : ""
          } m-1 p-1 rounded-md `}
        >
          <img
            src={
              self
                ? currentUser.profilePic
                : selectedConversation.userProfilePic
            }
            className={`size-8 rounded-full m-1`}
          />

          <div
            className={`flex flex-col mx-2 px-2 ${
              self ? "bg-blue-200" : "bg-green-200"
            } p-2 rounded-t-lg ${
              self ? "rounded-l-lg" : "rounded-r-lg"
            } max-w-md`}
          >
            <div className={`flex flex-col ${self && "items-end"}`}>
              <p>{message}</p>
              {self && <BsCheck2All color={seen? "blue":""} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
