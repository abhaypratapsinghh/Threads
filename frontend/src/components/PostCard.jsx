import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdVerified } from "react-icons/md";
import ImageSlider from "./ImageSlider";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { BiMessageRounded } from "react-icons/bi";
import Comment from "./Comment";
import axios from "axios";
import { UserAtom } from "../../atom/UserAtom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PostAtom } from "../../atom/PostAtom";
import useToastify from "../../hooks/Toast";

const PostCard = ({ post, setPost, postPage, cInd }) => {
  const user = useRecoilValue(UserAtom);
  const setPosts = useSetRecoilState(PostAtom);
  const navigate = useNavigate();
  const showToast = useToastify();

  const [currentPost, setCurrentPost] = useState(post);
  const [commentBox, setCommentBox] = useState(false);
  
  const [likeColor, setLikeColor] = useState(false);
  const [likeNum, setLikeNum] = useState(0);

  useEffect(() => {
    const likeButton = () => {
      setLikeColor(post.likes.includes(user._id));
      setLikeNum(post.likes.length);
    };

    likeButton();
  }, [post, user._id]);

  const handlleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (post) {
      try {
        const response = await axios({
          method: "post",
          url: `/api/v1/post/like/${post._id}`,
          withCredentials: true,
        });

        if (response) {
          if (!likeColor) {
            setLikeNum(likeNum + 1);
            setLikeColor(true);
          } else {
            setLikeNum(likeNum - 1);
            setLikeColor(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDelete = async () => {
    if (post) {
      if (!window.confirm("Are you sure you want to delete ?")) return;
      try {
        const response = await axios({
          method: "delete",
          url: `/api/v1/post/delete-post/${post._id}`,
          withCredentials: true,
        });

        if (response) {
          showToast("Deleted", "success");
          if (!postPage) {
            setPosts((prevPosts) =>
              prevPosts?.filter((p) => p._id !== post._id)
            );
          } else {
            if (postPage === 1) {
              setPosts((prevPosts) =>
                prevPosts?.filter((p) => p._id !== post._id)
              );
              navigate(`/`);
            } else {
              setPost((prevPost) => ({
                ...prevPost,
                replies: prevPost?.replies.filter((p) => p._id !== post._id),
              }));
            }
          }
        }
      } catch (err) {
        showToast("Error", "error");
        console.log(err);
      }
    }
  };
  


  return (
    <div>
      <Link to={`/post/${post._id}`} className="hover:cursor-pointer ">
        <div className="flex gap-3 pt-2 my-2">
          <div className="">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate(`/profile/${post.postedBy.username}`);
              }}
            >
              <img
                className="flex justify-center border rounded-full h-12 w-12 items-center my-2"
                src={post.postedBy.profilePic}
              ></img>
            </button>
          </div>

          <div className="max-w-sm sm:max-w-lg w-full">
            <div className="flex py-3 justify-between">
              <div className="flex flex-row items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(`/profile/${post.postedBy.username}`);
                  }}
                  className="hover:underline"
                >
                  <div className="font-semibold font-sans ">
                    {post.postedBy.name}
                  </div>
                </button>

                <MdVerified color="blue" />
              </div>
              <div className="flex gap-2 items-center font-mono">
                <div>{formatDistanceToNow(post.createdAt)}</div>
                {user._id == post.postedBy._id && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="bg-gray-100 rounded-full p-1"
                  >
                    <MdDelete color="maroon" size={24} />
                  </button>
                )}
              </div>
            </div>

            <div className="">
              <div>{post.text}</div>
              <div className="">
                <ImageSlider image={post.image} />
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button onClick={handlleLike}>
                {likeColor ? (
                  <IoHeart size={32} color="red" />
                ) : (
                  <IoHeartOutline size={32} />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCommentBox(!commentBox);
                }}
              >
                {cInd && <BiMessageRounded size={32} />}
              </button>
            </div>
            <div className="flex text-gray-700 text-sm gap-2 items-center font-mono text-center">
              <div>{likeNum} likes</div>
              <div>{currentPost.replies.length} replies</div>.
            </div>
          </div>
        </div>
      </Link>

      {commentBox && (
        <Comment
          pId={post._id}
          setCurrentPost={setCurrentPost}
          setCommentBox={setCommentBox}
        />
      )}
      <hr></hr>
    </div>
  );
};

export default PostCard;
