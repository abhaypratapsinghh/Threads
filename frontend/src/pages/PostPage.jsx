import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Oval } from "react-loader-spinner";

import { useState } from "react";
import axios from "axios";
import Comments from "../components/Comment";

const PostPage = () => {
  const { pId } = useParams();
  const [_, setCommentBox] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `/api/v1/post/get-post/${pId}`,
        });
        if (response) {
          setPost(response.data.post);
        }
      } catch (err) {
        if (!post) {
           setNotFound(true)
        }
        console.error(err.name);
      }
    };
    fetchPost();
    setLoading(false);
  }, [pId]);


  return (
    <>
      {loading ? (
        <div className="flex justify-center">
             <Oval height={32} width={32} color="black" secondaryColor="white"/>
        </div>
     
      ) : (
        <div>
          {notFound && (
            <div className="flex justify-center text-xl">Post Not Found</div>
          )}
        </div>
      )}

      {post ? (
        <PostCard post={post} setPost={setPost} cInd={false} postPage={1} />
      ) : (
        ""
      )}
      {post ? (
        <Comments
          pId={pId}
          setCurrentPost={setPost}
          setCommentBox={setCommentBox}
        />
      ) : (
        ""
      )}
      {post
        ? post.replies &&
          post.replies.length > 0 &&
          post.replies?.map((reply, ind) => (
            <div key={ind}>
              <PostCard
                post={reply}
                setPost={setPost}
                cInd={true}
                postPage={2}
              />
              <hr></hr>
            </div>
          ))
        : ""}
    </>
  );
};

export default PostPage;
