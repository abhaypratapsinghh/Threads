import { atom } from "recoil";

export const ConversationAtom = atom({
  key: "userConversations",
  default: [],
});
export const searchedConversationAtom = atom({
  key: "userSearchConversations",
  default: [],
});

export const selectedConversationAtom = atom({
  key: "userSlectedConversation",
  default: {
    id: "",
    userId: "",
    name: "",
    username:"",
    userProfilePic:""
  }
})

