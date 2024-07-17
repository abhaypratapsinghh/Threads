import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { RiDeleteBinFill, RiImageAddFill } from "react-icons/ri";
import { UserAtom } from "../../atom/UserAtom";
import { useRecoilValue } from "recoil";
import useMultiImgPreview from "../../hooks/multiImgPreview";
import { useRef } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import useToast from "../../hooks/Toast"

const Comments = ({pId,setCommentBox,setCurrentPost}) => {
  const max_length = 500;

  const imgRef = useRef(null);
  const user = useRecoilValue(UserAtom);
  let [text, setText] = useState("");
  let [length, setLength] = useState(0);
  const [loading, setLoading] = useState(false);


  const { imgUrl, handleImageChange, handleRemoveImage } = useMultiImgPreview();
  const showToast = useToast();



  const handleImageClick = () => {
    imgRef.current.click();
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        postedBy: user._id,
        text,
        img: imgUrl
      };

      if (text.length === 0) {
        alert("Text is Required");
        setLoading(false);
        return;
      }
      const response = await axios({
        method: "post",
        url: `/api/v1/post/reply/${pId}`,
        withCredentials: true,
        data,
      });

      if (response) {
        showToast("Posted", "success");
        setText("");
        setLength(0);
        handleRemoveImage(-1);
        setCurrentPost(response.data.post);
        setCommentBox(false);

      }
    } catch (err) {
      showToast("Error", "error");
      console.log(err);
    }

    setLoading(false);
  };




  return (
    <div>
      <div className="flex gap-3 pt-2 my-2">
        <div className="">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/user/:uId");
            }}
          >
            <img
              className="flex justify-center border rounded-full h-12 w-12 items-center my-2"
              src={user.profilePic}
            ></img>
          </button>
        </div>

        <div className="w-full">
          <div className="flex py-3 justify-between">
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/user/:uId");
                }}
                className="hover:underline"
              >
                <div className="font-semibold font-sans ">{user.name}</div>
              </button>

              <MdVerified color="blue" />
            </div>
          </div>
          <textarea
            className="w-full mr-2 bg-gray-200 rounded-xl text-xl p-2 h-20 focus:outline-none"
            placeholder="Add to thread..."
            value={text}
            onChange={(e) => handleTextChange(e)}
          />
          <p className="text-end font-sans">
            {length}/{max_length}
          </p>
          <div className="flex justify-between">
            <div className={`flex justify-evenly flex-row flex-wrap gap-4`}>
              {imgUrl?.map((image, ind) => (
                <div className="size-56">
                  <button
                    className="absolute text-red-800 "
                    onClick={(e) => handleRemoveImage(ind)}
                  >
                    <RiDeleteBinFill size={24} />
                  </button>
                  <img src={image} alt={ind + ".png"} />
                </div>
              ))}{" "}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-center items-center">
              <button onClick={handleImageClick}>
                <RiImageAddFill color="gray" size={32} cursor={"pointer"} />
              </button>
              <input
                type="file"
                multiple
                hidden
                ref={imgRef}
                onChange={handleImageChange}
              />
            </div>
            <button
              className="border px-6 py-1 rounded-2xl  bg-black text-white font-semibold text-xl"
              onClick={handleSubmit}
            >
              {loading ? (
                <Oval height={20} width={20} color="white" strokeWidth={8} />
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
  );
};

export default Comments;


