import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserProfilePage";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import SearchPage from "./pages/SearchPage";
import FeedPage from "./pages/FeedPage";
import { UserAtom } from "../atom/UserAtom";
import { useRecoilValue } from "recoil";
import ChatPage from "./pages/ChatPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const user = useRecoilValue(UserAtom);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route
            path="/"
            element={<Layout>{user ? <HomePage /> : <FeedPage />}</Layout>}
          />
          <Route
            path="/profile/:uName"
            element={<Layout>{user ? <UserPage /> : <SigninPage />}</Layout>}
          />
          <Route
            path="/create-new-post"
            element={
              <Layout>{user ? <CreatePostPage /> : <SigninPage />}</Layout>
            }
          />
          <Route
            path="/post/:pId"
            element={<Layout>{user ? <PostPage /> : <SigninPage />}</Layout>}
          />
          <Route path="/chat" element={user ? <ChatPage /> : <SigninPage />} />
          <Route
            path="/edit-profile/:uId"
            element={
              <Layout>
                {<Layout>{user ? <EditProfilePage /> : <SigninPage />}</Layout>}
              </Layout>
            }
          />
          <Route
            path="/search"
            element={<Layout>{user ? <SearchPage /> : <SigninPage />}</Layout>}
          />
        </Routes>
      </Router>
        <ToastContainer />
    </div>
  );
};

export default App;
