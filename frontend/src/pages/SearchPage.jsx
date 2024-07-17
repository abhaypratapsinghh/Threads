import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import axios from "axios";
import { UserAtom } from "../../atom/UserAtom";
import {useRecoilValue } from "recoil";
import { FaSearch } from "react-icons/fa";
import { useRef } from "react";
import NavBar from "../components/NavBar";


const SearchPage = () => {
  const inputRef = useRef();
  const currentUser = useRecoilValue(UserAtom);
  const [text, setText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      try {
        let sId = text;
        if (sId.length === 0) sId = ":";
        const response = await axios({
          method: "get",
          url: `/api/v1/user/profile/${sId}`,
          withCredentials: true,
        });

        if (response) {
          setSearchResult(response.data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [text]);

  const handleSearch = (e) => {
    e.preventDefault();
    setText(inputRef.current.value);
  }
  return (
    <div>
      <NavBar ind={1}/>
      <form className="mx-auto my-4">
        <div className="flex justify-between border rounded-lg">
          <div className="flex items-center p-2">
            <FaSearch size={28} color="gray" />
          </div>
          <input
            type="search"
            className="focus-within:outline-none w-full text-lg text-gray-700"
            placeholder="Search ..."
            ref={inputRef}
            required
            onChange={(e) => {
              e.target.value == 0 ? setText(":") : "";
            }}
          />
          <button
            type="submit"
            className="m-2 bg-gray-500 rounded-lg px-5 hover:bg-gray-300
            py-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </form>

      {text !==":" && text!=="" && (
        <h1 className="p-3 text-xl">
          {searchResult.length>0 ? "":"No "}Result Found For '{text}'
        </h1>
      )}
      {searchResult &&
        searchResult.map((user, ind) => (
          <div key={ind}>
            <div className="p-3 text-xl"></div>
            {currentUser._id !== user._id && <ProfileCard user={user} />}
          </div>
        ))}
    </div>
  );
};

export default SearchPage;
