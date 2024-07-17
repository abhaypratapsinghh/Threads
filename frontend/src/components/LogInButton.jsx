import React from "react";
import { BiLogIn } from "react-icons/bi";
import {useNavigate} from "react-router-dom"

const LogInButton = () => {
    const navigate = useNavigate();
    const handleLogIn = () => {
        navigate("/signin");
    }
    return (
      <div>
        <button
          className="w-auto rounded-lg text-green-800"
          onClick={handleLogIn}
        >
          <BiLogIn size={54} />
        </button>
      </div>
    );
}

export default LogInButton;