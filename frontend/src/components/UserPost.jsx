import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { PostAtom } from "../../atom/PostAtom";
import { ReplyAtom } from "../../atom/ReplyAtom";
import { useRecoilState } from "recoil";
import PostCard from "./PostCard";

const UserPost = (prop) => {
  const [clicked, setClicked] = useState([true, false]);

  const [posts, setPosts] = useRecoilState(PostAtom);
  const [reply, setReply] = useRecoilState(ReplyAtom);
  const uId = prop.uId;
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (uId) {
          const response = await axios({
            method: "get",
            url: `/api/v1/post/userposts/${uId}`,
            withCredentials: true,
          });
          if (response) {
            setPosts(response.data.feedPosts);
          }
        }
      } catch (err) {
       console.error(err);
      }
    };
    fetchPostData();
  }, [uId,clicked]);

  useEffect(
    () => async () => {
      try {
        if (uId) {
          const response = await axios({
            method: "get",
            url: `/api/v1/post/user-replies/${uId}`,
          });
          if (response) {
            setReply(response.data.feedPosts);
          }
        }
      } catch (err) {
       console.error(err);
      }
    },
    [clicked]
  );


  return (
    <div>
      <div>
        <div className="flex justify-evenly font text-lg mt-5">
          <button
            className={`flex justify-center w-1/2 ${
              clicked[0] ? "shadow-md bg-gray-100 p-1 rounded-md" : ""
            }`}
            onClick={(e) => setClicked([true, false])}
          >
            Threads
          </button>
          <button
            className={`flex justify-center w-1/2 ${
              clicked[1] ? "shadow-md bg-gray-100 p-1 rounded-md" : ""
            }`}
            onClick={(e) => setClicked([false, true])}
          >
            Replies
          </button>
        </div>
        <hr />

        {clicked[0] &&
          posts?.map((post, ind) => (
            <div key={ind}>
              {post && <PostCard post={post} setPosts={setPosts} cInd={true} />}
            </div>
          ))}
        {clicked[1] &&
          reply?.map((post, ind) => (
            <div key={ind}>
              {reply && (
                <PostCard post={post} setPosts={setReply} cInd={true} />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserPost;
