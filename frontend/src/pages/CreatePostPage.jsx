import React, { useState, useRef } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { UserAtom } from "../../atom/UserAtom";
import useMultiImgPreview from "../../hooks/multiImgPreview";
import { useRecoilValue } from "recoil";
import { useNavigate, Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { RiDeleteBinFill, RiImageAddFill } from "react-icons/ri";
import { Oval } from "react-loader-spinner";
import useToastify from "../../hooks/Toast";

const CreatePostPage = () => {

  const max_length = 500;

  const user = useRecoilValue(UserAtom);
  const [text, setText] = useState("");
  const [length, setLength] = useState(500);
  const [loading, setLoading] = useState(false)

  const imgRef = useRef(null);
  const navigate = useNavigate();

  const showToast = useToastify();
  const { imgUrl, handleImageChange, handleRemoveImage } =
      useMultiImgPreview();


  const handleImageClick = () => {
    imgRef.current.click();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        postedBy: user._id,
        text,
        img: imgUrl,
      };
      if (text.length == 0) {
        showToast("Text is Required","warn");
        setLoading(false);
        return;
      }
      const response = await axios({
        method: "post",
        url: "/api/v1/post/create",
        withCredentials: true,
        data,
      });

      if (response) {
        showToast("Posted","success")
        navigate("/")
      }
    } catch (err) {
      showToast("Error", "error");
      console.log(err);
    }
    setLoading(false);
  };
  const handleTextChange = (e) => {
    let text = e.target.value;
    if (text.length > max_length) {
      text = text.substring(0, max_length);
      setText(text);
      setLength(0);
    } else {
      setText(text);
      setLength(max_length - text.length);
    }
  };

  return (
    <div>
      <NavBar ind={2} />
      <div className="">
        <div className="flex gap-3 pt-2 my-2">
          <div className="">
            <Link to={`/profile/${user.username}`}>
              <img
                className="flex justify-center border rounded-full h-12 w-12 items-center my-2"
                src={user.profilePic}
              ></img>
            </Link>
          </div>

          <div className="w-full">
            <div className="flex py-3 justify-between">
              <div className="flex flex-row items-center gap-2">
                <Link
                  to={`/profile/${user.username}`}
                  className="hover:underline"
                >
                  <div className="font-semibold font-sans ">{user.name}</div>
                </Link>

                <MdVerified color="blue" />
              </div>
            </div>

            <textarea
              className="w-full mr-2 bg-gray-200 rounded-xl text-xl p-2 h-40 focus:outline-none"
              placeholder="Start a thread..."
              value={text}
              onChange={(e) => handleTextChange(e)}
            />
            <p className="text-end font-sans">
              {length}/{max_length}
            </p>
            <div className={`flex justify-evenly flex-row flex-wrap gap-4`}>
              {imgUrl?.map((image, ind) => (
                <div className="size-56 " key={ind}>
                  <button
                    className="absolute text-red-800 "
                    onClick={(e) => handleRemoveImage(ind)}
                  >
                    <RiDeleteBinFill size={24} />
                  </button>
                  <img src={image} alt={ind + ".png"} />
                </div>
              ))}{" "}
              <div className="size-56 flex justify-center items-center">
                <button onClick={handleImageClick}>
                  <RiImageAddFill color="gray" size={96} cursor={"pointer"} />
                </button>
                <input
                  type="file"
                  multiple
                  hidden
                  ref={imgRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="flex justify-end w-full my-3">
        <button
          className="border px-6 py-2 rounded-2xl  bg-black text-white font-semibold text-xl"
          onClick={handleSubmit}
        >
          {loading ? <Oval height={20} width={20} color="white" strokeWidth={8}/> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostPage;
