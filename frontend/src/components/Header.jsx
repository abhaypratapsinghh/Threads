import React from "react";
import  Logo  from "../assets/threads-icon.svg";

const Header = () => {
    return (
        <div className="flex justify-center mt-3 mb-2">
            <img className="cursor-pointer h-10" alt="logo" src={Logo} />
        </div>
    )
}

export default Header;