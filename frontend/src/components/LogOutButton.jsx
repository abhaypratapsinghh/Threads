import React from "react";
import { BiLogOut } from "react-icons/bi";
import { UserAtom } from "../../atom/UserAtom";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/Toast";

const LogOutButton = () => {
  const setUser = useSetRecoilState(UserAtom);
  const showToast = useToast();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("thread-user");
      const response = await axios({
        method: "post",
        url: "/api/v1/user/logout",
        withCredentials: true,
      });
      if (response) {
        showToast("Logged out", "warn");
        setUser(null);
        navigate("/");
      }
    } catch (err) {
      showToast("Error", "error");
      console.log(err);
    }
  };

  return (
    <div>
      <button className="w-auto rounded-lg text-red-800" onClick={handleLogout}>
        <BiLogOut size={54} />
      </button>
    </div>
  );
};

export default LogOutButton;
