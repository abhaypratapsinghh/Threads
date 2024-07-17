import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow`}
      style={{ ...style, display: "block", background: "darkgray" }}
      onClick={onClick}
    >
      <FaArrowLeft color="white" />
    </div>
  );
};

export const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow`}
      style={{ ...style, display: "block", background: "darkgray" }}
      onClick={onClick}
    >
      <FaArrowRight color="white" />
    </div>
  );
};
