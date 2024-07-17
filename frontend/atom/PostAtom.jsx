import { atom } from "recoil";

const PostAtom = atom({
  key: "userPosts",
  default: null,
});

export { PostAtom};
