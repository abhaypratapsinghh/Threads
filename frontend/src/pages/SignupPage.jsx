import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
import useToastify from "../../hooks/Toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const showToast = useToastify();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePic: "/img1.webp"
  });

  const [checkPassword, setCheckPassword] = useState(false);

  useEffect(() => {
    setCheckPassword(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/user/signup",
        data: formData,
      });
      if (response) {
        showToast("Signup successfully" ,"success")
          navigate("/signin");
      }
    } catch (err) {
      showToast("Error signing up/Enter valid Credentials", "error");
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
    <div className="flex justify-center h-screen items-center bg-gray-300 bg-cover ">
      <div className="flex flex-col w-96   border-black rounded-lg p-5 text-justify justify-center bg-black bg-opacity-70">
        <h1 className="w-full text-center text-white font-bold text-4xl my-3">
          Sign Up
        </h1>
        <form className="flex flex-col ">
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"text"}
            name={"name"}
            placeholder={"Name"}
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"text"}
            name={"username"}
            placeholder={"Username"}
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"email"}
            name={"email"}
            placeholder={"Email"}
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"password"}
            autoComplete="current-password"
            name={"password"}
            placeholder={"Password"}
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="p-6 m-2 text-center rounded-md text-xl h-9 placeholder-black outline-none "
            type={"password"}
            name={"confirmPassword"}
            placeholder={"Confirm Password"}
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {!checkPassword && (
            <p className="text-red-400 self-center">Password not matched</p>
          )}

          {/* <button
            className="hover:bg-green-700 self-center m-2 px-5 py-2 bg-red-700 text-white text-xl text-center rounded-lg"
            type={"submit"}
            onClick={handleSubmit}
          >
            {"Register"}
          </button> */}
          <button
            className={`hover:bg-green-700 self-center m-2 px-5 py-2 ${
              loading ? "bg-green-700" : "bg-red-700"
            } text-white text-xl text-center rounded-lg`}
            type={"submit"}
            onClick={handleSubmit}
          >
            <div className="flex items-center gap-2">
              {"Register"}
              {loading && <Oval height={20} width={20} color="white" />}
            </div>
          </button>
        </form>
        <p className="m-2 text-center text-md text-white">
          Already have a account?
          <a className="underline hover:text-blue-800" href="/signin">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
