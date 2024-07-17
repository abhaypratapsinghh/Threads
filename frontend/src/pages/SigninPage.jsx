import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserAtom } from "../../atom/UserAtom";
import { useSetRecoilState } from "recoil";
import { Oval } from "react-loader-spinner";
import useToastify from "../../hooks/Toast";

const SigninPage = () => {
  const showToast = useToastify();
  const setUser = useSetRecoilState(UserAtom);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/user/signin",
        data: formData,
        withCredentials:true
      });

      if (response) {
        console.log(response.data);
        localStorage.setItem("thread-user", JSON.stringify(response.data));
        setUser(response.data);
        showToast("Logged in successfully", "success");
        navigate("/");
        setLoading(false);
      }
    } catch (err) {
      showToast("Error Logging in", "error");
      console.log(err)
      setLoading(false);
    }
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex justify-center h-screen items-center bg-gray-200 bg-cover ">
      <div className="flex flex-col w-96  border-black rounded-lg p-5 text-justify justify-center bg-black bg-opacity-70">
        <h1 className="text-4xl font-semibold text-center text-white p-5">
          Login
        </h1>
        <form className="flex flex-col gap-2">
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"username"}
            name={"username"}
            placeholder={"Username"}
            onChange={handleChange}
          />

          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"password"}
            name={"password"}
            autoComplete="current-password"
            placeholder={"Password"}
            onChange={handleChange}
          />

          <button
            className={`hover:bg-green-700 self-center m-2 px-5 py-2 ${loading? "bg-green-700" : "bg-red-700"} text-white text-xl text-center rounded-lg`}
            type={"submit"}
            onClick={handleSubmit}
          >
            <div className="flex items-center gap-2">
              {"Login"}
              {loading && <Oval height={20} width={20} color="white"/>}
            </div>
          </button>
        </form>
        <p className="m-2 text-center text-md text-white" href="/login">
          Don't have a account?
          <a className="hover:underline hover:text-blue-800" href="/signup">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
