import React from "react";

import LogOutButton from "./LogOutButton";
import LogInButton from "./LogInButton";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserAtom } from "../../atom/UserAtom";
import { Link } from "react-router-dom";
import {
  IoChatbox,
  IoChatboxOutline,
  IoHeartOutline,
  IoHomeOutline,
  IoPencilOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";

const NavBar = ({ ind }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(UserAtom);

  let clicked = [0, 0, 0, 0, 0 , 0];
  clicked[ind] = 1;

  const handleOnClick = (address) => {
    navigate(address);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3">
        <div className=""> {user ? <LogOutButton /> : <LogInButton />}</div>
        <Link to={`/`} className="flex justify-center p-1">
          <img
            className="cursor-pointer h-10"
            alt="logo"
            src={"/threads-icon.svg"}
          />
        </Link>
      </div>

      <div className="flex justify-evenly font">
        <button
          onClick={() => handleOnClick(`/`)}
          className={`flex justify-center w-1/5 p-2
          ${
            clicked[0] ? "shadow-md bg-gray-100 rounded-lg" : ""
          }  hover:shadow-md hover:bg-gray-100 hover:
          rounded-lg`}
        >
          <IoHomeOutline size={32} />
        </button>
        <button
          className={`flex justify-center w-1/5 p-2
          ${
            clicked[1] ? "shadow-md bg-gray-100 rounded-lg" : ""
          }  hover:shadow-md hover:bg-gray-100 hover:
          rounded-lg`}
          onClick={() => handleOnClick(`/search`)}
        >
          <IoSearchOutline size={32} />
        </button>
        <button
          className={`flex justify-center w-1/5 p-2
          ${
            clicked[2] ? "shadow-md bg-gray-100 rounded-lg" : ""
          }  hover:shadow-md hover:bg-gray-100 hover:
          rounded-lg`}
          onClick={() => {
            handleOnClick(`/create-new-post`);
          }}
        >
          <IoPencilOutline size={32} />
        </button>
        <button
          className={`flex justify-center w-1/5 p-2
          ${
            clicked[4] ? "shadow-md bg-gray-100 rounded-lg" : ""
          }  hover:shadow-md hover:bg-gray-100 hover:
          rounded-lg`}
          onClick={() => {
            handleOnClick(`/chat`);
          }}
        >
          <IoChatboxOutline size={32} />
        </button>
        <button
          className={`flex justify-center w-1/5 p-2
          ${
            clicked[5] ? "shadow-md bg-gray-100 rounded-lg" : ""
          }  hover:shadow-md hover:bg-gray-100 hover:
          rounded-lg`}
          onClick={() => {
            if (user) {
              handleOnClick(`/profile/${user._id ? user.username : ""}`);
            } else navigate("/signin");
          }}
        >
          <IoPersonOutline size={32} />
        </button>
      </div>
      <hr />
    </div>
  );
};

export default NavBar;
