import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import NavBar from "../components/NavBar"
import usePreviewImg from "../../hooks/ImgPreview";


import { UserAtom } from "../../atom/UserAtom";
import { useRecoilState } from "recoil";

import { Oval } from "react-loader-spinner";
import useToastify from "../../hooks/Toast";

const EditProfilePage = () => {
  const { uId } = useParams();
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(UserAtom);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { imgUrl, handleImageChange } = usePreviewImg();
  const showToast = useToastify();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  });
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      formData.profilePic = imgUrl;
      const response = await axios({
        method: "post",
        url: `/api/v1/user/update/${uId}`,
        data: formData,
        withCredentials: true,
      });

      if (response) {
        showToast("Profile updated", "success");
        localStorage.setItem("thread-user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate(`/profile/${response.data.user.username}`);
      }
    } catch (err) {
      showToast("Error", "error");
      console.error(err);
    }
    setLoading(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showPassword = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  return (
    <div>
      <NavBar/>
      <div className="flex justify-center h-screen bg-cover ">
        <div className="flex flex-col w-full rounded-lg p-5 text-justify justify-center bg-gray-400 ">
          <h1 className="text-4xl font-semibold text-center text-white p-5">
            Edit Profile
          </h1>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-between">
              <img
                className="size-44 rounded-full shadow-lg shadow-black bg-white"
                src={imgUrl || user.profilePic || "/img1.webp"}
              />
              <button
                type="button"
                className="w-full h-12 bg-white rounded-md text-xl text-gray-400"
                onClick={() => fileRef.current.click()}
              >
                Edit Profile Picture
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </button>
            </div>
            <div className="flex items-center">
              <p className="text-center text-xl w-1/4">Name :</p>
              <input
                className="w-3/4 p-6 m-2 text-center rounded-md text-xl h-9 placeholder-gray-400 outline-none "
                type={"name"}
                name={"name"}
                value={formData.name}
                placeholder={"Name"}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex items-center">
              <p className="text-center text-xl w-1/4">Username :</p>
              <input
                className="w-3/4 p-6 m-2 text-center rounded-md text-xl h-9 placeholder-gray-400 outline-none "
                type={"username"}
                name={"username"}
                value={formData.username}
                placeholder={"Username"}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex items-center">
              <p className="text-center text-xl w-1/4">Email :</p>
              <input
                className="w-3/4 p-6 m-2 text-center rounded-md text-xl h-9 placeholder-gray-400 outline-none "
                type={"email"}
                name={"email"}
                value={formData.email}
                placeholder={"Email"}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex items-center">
              <p className="text-center text-xl w-1/4">Bio :</p>
              <input
                className="w-3/4 p-6 m-2 text-center rounded-md text-xl h-9 placeholder-gray-400 outline-none "
                type={"bio"}
                name={"bio"}
                value={formData.bio}
                placeholder={"Bio"}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex items-center">
              <p className="text-center text-xl w-1/4">PassWord :</p>
              <input
                className="w-3/4 m-2 p-6 text-center rounded-md text-xl h-9 placeholder-gray-400 outline-none "
                type={"password"}
                id={"password"}
                name={"password"}
                autoComplete="current-password"
                placeholder={"Password"}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="flex ml-40">
              <input
                type="checkBox"
                className="size-5"
                onClick={showPassword}
              />
              <p>Show password</p>
            </div>

            <button
              className={`hover:bg-green-700 self-center m-2 px-5 py-2 ${
                loading ? "bg-green-700" : "bg-red-700"
              } text-white text-xl text-center rounded-lg `}
              type={"submit"}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="flex items-center gap-2">
                {"Submit"}
                {loading ? <Oval height={20} width={20} color="white" /> : ""}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
