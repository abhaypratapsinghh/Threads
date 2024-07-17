import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      
      <div className="bg-gray-100 min-h-screen flex justify-center">
        <div className="w-screen md:max-w-screen-sm bg-white p-2 rounded-lg shadow-md font-serif">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
