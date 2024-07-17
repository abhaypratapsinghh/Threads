import React,{ useState } from "react"

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result)
            }

            reader.readAsDataURL(file);
        }
        else {
            console.log("error reading image");
            setImgUrl(null);
        }
    };
    return { handleImageChange, imgUrl };
}

export default usePreviewImg;