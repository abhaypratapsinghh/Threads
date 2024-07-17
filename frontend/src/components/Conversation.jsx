import React from "react";
import { MdVerified } from "react-icons/md";
import { BsCheck2All } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ConversationAtom,
  selectedConversationAtom,
} from "../../atom/ConversationAtom";
import { UserAtom } from "../../atom/UserAtom";

const Conversation = ({ ind ,isOnline}) => {
  const conversations = useRecoilValue(ConversationAtom);
  const user = conversations[ind].participants[0];
  const currentUser = useRecoilValue(UserAtom);
  const lastMessage = conversations[ind].lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  return (
    <div>
      <div
        className={`flex m-1 p-1 border rounded-md ${
          selectedConversation.userId === user._id
            ? "bg-slate-400"
            : "bg-slate-200"
        } hover:cursor-pointer`}
        onClick={() =>
          setSelectedConversation({
            _id: conversations[ind]._id,
            userId: user._id,
            userProfilePic: user.profilePic,
            name: user.name,
            username: user.username,
          })
        }
      >
        <div className="relative min-w-14">
          <img src={user.profilePic ||"/img1.webp"} className={`size-12 rounded-full`} />
          {isOnline && <GoDotFill
            color="green"
            size={28}
            className="absolute -bottom-2 -right-1 z-2"
          />}
        </div>

        <div className="mx-2 px-2 overflow-x-hidden">
          <div className="flex items-center text-lg">
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            <MdVerified color="blue" />
          </div>
          <div className="text-gray-600 text-nowrap flex gap-2 items-center">
            <div>
              {currentUser._id === lastMessage.sender &&
              <div>
                {lastMessage.seen ?  <BsCheck2All size={20} color="blue"/> :<BsCheck2All size={20}/>}
                </div>
            }
            </div>
            <>
              {lastMessage.text.length > 25
              ? lastMessage.text.substring(0, 30) + "...."
              : lastMessage.text}
            </>
            
            
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Conversation;
