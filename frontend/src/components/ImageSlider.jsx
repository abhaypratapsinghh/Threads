import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow custom-arrow"
      onClick={onClick}
      style={{ left: "10px", zIndex: 1 }}
    >
      <FaArrowCircleLeft size={32} color="gray" />
    </div>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow custom-arrow"
      onClick={onClick}
      style={{ right: "10px", zIndex: 1 }}
    >
      <FaArrowCircleRight size={32} color="gray"/>
    </div>
  );
};


const ImageSlider = (props) => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow:<PrevArrow/>,
    nextArrow: <NextArrow/>,
  };

  const images  = props.image;

    return (
      <div>
        {images.length > 1 && (
          <Slider {...settings}>
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-96 overflow-hidden max-w-sm sm:max-w-lg"
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="absolute top-1/2 left-1/2 h-full w-auto transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            ))}
          </Slider>
        )}
        {images.length === 1 && (
          <div className="relative h-96 overflow-hidden">
            <img
              src={images[0]}
              alt={`Slide 1`}
              className="absolute top-1/2 left-1/2 h-full transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        )}
      </div>
    );
};

export default ImageSlider;
