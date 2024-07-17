import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ConversationSkeletons = () => {
  return (
    <div className="flex m-1 p-1 border rounded-md bg-slate-200">
      <div className="relative min-w-14">
        <Skeleton circle={true} height={32} width={32} />
        <Skeleton
          width={16}
          height={16}
          circle={true}
          className="absolute -bottom-1 -right-1 z-2"
        />
      </div>

      <div className="mx-2 px-2 max-w-xs overflow-x-hidden">
          <Skeleton width={150} />
        <Skeleton width={`80%`} />
      </div>
    </div>
  );
};

export default ConversationSkeletons;
