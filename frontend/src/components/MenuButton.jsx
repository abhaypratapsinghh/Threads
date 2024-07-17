import React,{ useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";


import { UserAtom } from "../../atom/UserAtom";
import { useRecoilValue } from "recoil";
import useToastify from "../../hooks/Toast";



const MenuButton = ({ prop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const user = useRecoilValue(UserAtom);
  const { uName } = useParams();
  const showToast = useToastify();

  const toggleMenu = (e) => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
      setUrl(window.location.href);
    }
  };

  const handleCopy = async () => {

    await navigator.clipboard.writeText(window.location.href);
    showToast("Profile link copied", "success");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleMenu}>{prop}</button>
      {isOpen && (
        <div
          className="origin-top-right absolute w-32 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
          ref={menuRef}
        >
          <div className="py-1" role="none">
            {(uName===user.username) && <Link
              to={user?`/edit-profile/${user._id}`:`/signin`}
              className="text-gray-700 block px-4 py-3 text-md hover:bg-gray-500 hover:rounded-md hover:text-white"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
            >
              Edit Profile
            </Link>}
            <a
              className="text-gray-700 block px-4 py-3 text-md  hover:bg-gray-500 hover:rounded-md hover:text-white"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
              onClick={handleCopy}
            >
              Copy Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuButton;
