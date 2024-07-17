import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatsSkeleton = ({ self }) => {
  return (
    <div className={`flex ${self ? "justify-end" : ""}`}>
      <div className="">
        <div
          className={`flex ${
            self ? "flex-row-reverse" : ""
          } m-1 p-1 rounded-md`}
        >
          <Skeleton circle={true} height={32} width={32} className="m-1" />

          <div
            className={`flex flex-col mx-2 px-2 ${
              self ? "bg-blue-200" : "bg-green-200"
            } p-2 rounded-t-lg ${
              self ? "rounded-l-lg" : "rounded-r-lg"
            } max-w-md`}
          >
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton width={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsSkeleton;
