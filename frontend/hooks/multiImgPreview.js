import React, { useState } from "react";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgUrl = [];

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImgUrl.push(reader.result);
          if (newImgUrl.length === files.length) {
            setImgUrl((prevImgUrl) => [...prevImgUrl, ...newImgUrl]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log("error reading image");
      }
    });
  };

  const handleRemoveImage = (ind) => {
    if (ind === -1) setImgUrl([]);
    else {
      const newImg = imgUrl.filter((_, index) => ind != index);
      setImgUrl(newImg);
    }
  };

  return { handleImageChange, imgUrl, handleRemoveImage };
};

export default usePreviewImg;
