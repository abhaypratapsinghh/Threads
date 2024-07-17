import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { UserAtom } from "../../atom/UserAtom";
import { useRecoilState } from "recoil";
import { FaSpinner } from "react-icons/fa";
import useToastify from "../../hooks/Toast";
import axios from "axios";

const ProfileCard = (prop) => {
  
  const user = prop.user;


  const [currentUser, setCurrentUser] = useRecoilState(UserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [follow, setFollow] = useState(!currentUser.following.includes(user._id));
  const [followerCount, setFollowerCount] = useState(user.followers.length);


  const showToast = useToastify();

  const handleFollow = async (e) => {
    setIsLoading(true);
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: `/api/v1/user/follow/${user?._id}`,
        withCredentials: true,
      });

      if (response) {
        localStorage.setItem(
          "thread-user",
          JSON.stringify(response.data.currentUser)
        );
        setCurrentUser(response.data.currentUser);
        if (follow) {
          showToast("Followed", "success");
          setFollowerCount(followerCount + 1);
        } else {
          showToast("Unfollowed", "success");
          setFollowerCount(followerCount - 1);
        }

        setFollow(!follow);
      }
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };
  return (
    <div>
      <Link to={`/profile/${user.username}`} className="py-5 px-2 flex">
        <img
          className="flex justify-center border rounded-full h-12 w-12 items-center my-2"
          src={user.profilePic || "/img1.webp"}
        ></img>

        <div className="mx-3 text-lg w-full flex justify-between">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <p>{user.username.substring(1)}</p>
              <MdVerified color="blue" />
            </div>
            <p className="text-gray-500">
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </p>
            <div className="flex gap-2">
              <p>{followerCount}</p>
              <p>{followerCount < 10 ? "follower" : "followers"}</p>
            </div>
          </div>

          <div className="flex items-center">
            {user && !currentUser.following.includes(user._id) && (
              <button
                className="w-full bg-black text-white px-5 rounded-lg shadow-md shadow-slate-800 my-4 py-2"
                onClick={(e) => {
                  handleFollow(e);
                }}
              >
                {isLoading ? <FaSpinner /> : "Follow"}
              </button>
            )}
            {user && currentUser.following.includes(user._id) && (
              <button
                className="w-full bg-white  rounded-lg shadow-md shadow-slate-800 my-4 px-5 py-2"
                onClick={(e) => {
                  handleFollow(e);
                }}
              >
                {isLoading ? <FaSpinner /> : "Following"}
              </button>
            )}
          </div>
        </div>
      </Link>
      <hr />
    </div>
  );
};

export default ProfileCard;
