import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillInstagram } from "react-icons/ai";
import { PiDotsThreeCircleThin } from "react-icons/pi";
import MenuButton from "./MenuButton";
import { UserAtom } from "../../atom/UserAtom";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import UserPost from "../components/UserPost";
import { FaSpinner } from "react-icons/fa";
import useToastify from "../../hooks/Toast";

const UserHeader = () => {
  const { uName } = useParams();
  const navigate = useNavigate();


  const [user, setUser] = useRecoilState(UserAtom);
  const [profileData, setProfileData] = useState(null);
  const [following, setFollowing] = useState(
    user.following.includes(profileData?._id));
  const [loading, setLoading] = useState(false);

  const showToast = useToastify();



  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios({
          method: "get",
          url: `/api/v1/user/profile/${uName}`,
        });

        if (res) {
          setProfileData(res.data.user[0]);
          if (profileData?._id !== user?._id) {
            setFollowing(user.following.includes(profileData?._id));
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [uName]);
  

  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: `/api/v1/user/follow/${profileData?._id}`,
        withCredentials: true,
      });

      if (response) {
        if (following) {
          showToast("Unfollowed","success");
          setProfileData((prevData) => {
            const updatedData = {
              ...prevData,
              followers: [...prevData.followers, user?._id],
            }
            return updatedData;
          });
          setFollowing(false);
        }
        else {
          showToast("Followed","success");
          setProfileData((prevData) => {
            const updatedData = {
              ...prevData,
              followers: prevData.followers.filter((follower) => (follower !== user._id))
            }
            return updatedData;
          });
          setFollowing(true);
        }
        localStorage.setItem(
          "thread-user",
          JSON.stringify(response.data.currentUser)
        );
        setUser(response.data.currentUser);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };


  return (
    <div className="px-6">
      {!profileData ? (
        <div className="flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="flex flex-col lg:flex lg:flex-row items-center lg:justify-between">
            <div className="my-2">
              <h1 className="text-3xl font-semibold text-center">
                {profileData.name.toUpperCase()}
              </h1>
              <p className="my-2 text-center">
                {profileData.username}
                <a
                  className="bg-gray-200 rounded-lg p-1"
                  onClick={() => navigate("/")}
                >
                  threads.net
                </a>
              </p>
            </div>
            <img
              className="flex justify-center border  rounded-full size-40 items-center my-2"
              src={profileData.profilePic || "/img1.webp"}
            ></img>
          </div>
          <article
            className="text-lg text-center lg:text-start text-wrap w-full"
            style={{
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {profileData.bio}
          </article>

          <div className="flex flex-col lg:flex lg:flex-row items-center flex-wrap lg:justify-between ">
            <div className="my-3 flex gap-3 text-gray-600">
              <p className="text-lg font-mono">
                {profileData.followers.length + " "}
                <a className="font-serif">followers</a>
              </p>
              <p className="text-lg font-mono">
                {profileData.following.length + " "}
                <a className="font-serif">following</a>
              </p>
            </div>
            <div className="my-2 flex flex-row">
              <div>
                <AiFillInstagram color="" size={32} />
              </div>
              <div>
                <MenuButton prop={<PiDotsThreeCircleThin size={32} />} />
              </div>
            </div>
          </div>

          {user &&
          user.username !== uName &&
          !user.following.includes(profileData._id) ? (
            <button
              className="w-full bg-black text-white py-2 rounded-lg shadow-md shadow-slate-800 my-4 flex justify-center"
              onClick={() => {
                handleFollow();
              }}
            >
              {loading ? <FaSpinner size={28} /> : "Follow"}
            </button>
          ) : (
            ""
          )}

          {user &&
          user.username !== uName &&
          user.following.includes(profileData._id) ? (
            <button
              className="w-full bg-white rounded-lg py-2 shadow-md shadow-slate-800 my-4 flex justify-center"
              onClick={() => {
                handleFollow();
              }}
            >
              {loading ? <FaSpinner size={28} /> : "Following"}
            </button>
          ) : (
            ""
          )}
        </div>
      )}
      {profileData && <UserPost uId={profileData._id} />}
    </div>
  );
};

export default UserHeader;
