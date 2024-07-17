import { atom } from "recoil";

const ReplyAtom = atom({
  key: "userReply",
  default: null,
});

export { ReplyAtom };
