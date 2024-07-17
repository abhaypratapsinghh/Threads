import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { UserAtom } from "../../atom/UserAtom";
import NavBar from "../components/NavBar";
import axios from "axios";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { PostAtom } from "../../atom/PostAtom";
import { useRecoilState } from "recoil";
import Loader from "../components/Loader";

const HomePage = () => {
  const user = useRecoilValue(UserAtom);
  const navigate = useNavigate();
  const [posts,setPosts] = useRecoilState(PostAtom)

  useEffect(() => {
   
    const fetchFeed = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "/api/v1/post/feed",
        });

        if (response) {
          setPosts(response.data.feedPosts);
        }
      } catch (err) {
       console.error(err);
      }
    };

    fetchFeed();
  }, []);


    useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, []);

  return (
    <div>
      <NavBar ind={0} />
      {!user ? (
        <div className="flex justify-center h-96">
          <Loader />
        </div>
      ) : posts &&
        posts.map((post, ind) => (
          <div key={ind}>
            <PostCard post={post} setPosts={setPosts} cInd={true}/>
          </div>
        ))}
    </div>
  );
};

export default HomePage;
