import React, { useEffect } from "react";
import UserHeader from "../components/UserHeader";
import NavBar from "../components/NavBar";

import { UserAtom } from "../../atom/UserAtom";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const user = useRecoilValue(UserAtom);
    const navigate = useNavigate();
    useEffect(() => { 
        if (!user) {
            navigate("/signin");
        }
    })
    return (  
         <div>
            <NavBar ind={5} />
            <UserHeader/>
            
        </div>   

    )
};

export default UserPage;