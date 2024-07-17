import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import ImageSlider from "../components/ImageSlider";
import { IoHeartOutline } from "react-icons/io5";
import { BiMessageRounded } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";

const FeedPage = () => {


  const [feedData, setFeedData] = useState([]);
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "/api/v1/post/feed",
        });

        if (response) {
          setFeedData(response.data.feedPosts);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <NavBar ind={0} />
      {feedData &&
        feedData.map((post, ind) => (
          <div key={ind}>
            <Link to={`/post/${post._id}`} className="">
              <div className="flex gap-3 pt-2 my-2">
                <div className="">
                  <Link to={`/profile/${post.postedBy.username}`}>
                    <img
                      className="flex justify-center border rounded-full h-12 w-12 items-center my-2"
                      src={post.postedBy.profilePic}
                    ></img>
                  </Link>
                </div>

                <div className="max-w-md sm:max-w-lg w-full">
                  <div className="flex py-3 justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        to={`/profile/${post.postedBy.username}`}
                        className="hover:underline"
                      >
                        <div className="font-semibold font-sans ">
                          {post.postedBy.name}
                        </div>
                      </Link>

                      <MdVerified color="blue" />
                    </div>
                    <div className="flex gap-2 items-center font-mono">
                      <div>{formatDistanceToNow(post.createdAt)}</div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="bg-gray-100 rounded-full p-1"
                      >
                        <BsThreeDots size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="">
                    <div>{post.text}</div>
                    <div className="">
                      <ImageSlider image={post.image} />
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <IoHeartOutline size={32} />
                    <BiMessageRounded size={32} />
                  </div>
                  <div className="flex text-gray-700 text-sm gap-2 items-center font-mono text-center">
                    <div>{post.replies.length} replies</div>.
                    <div>{post.likes.length}likes</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default FeedPage;
