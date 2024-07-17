import { atom } from 'recoil';

const UserAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("thread-user")),
});


export { UserAtom};