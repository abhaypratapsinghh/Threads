import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <Oval
      visible={true}
      height="60"
      width="60"
      color="black"
    secondaryColor="black"
      strokeWidth={2}
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;
