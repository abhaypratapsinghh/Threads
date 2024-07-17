import { toast } from "react-toastify";

const useToastify = () => {
  const options = {
    theme: "dark",
    position: "top-center",
    autoClose:1500,
  };

  const showToast = (message, type = "default") => {
    switch (type) {
      case "success":
        toast.success(message,options);
        break;
      case "error":
        toast.error(message,options);
        break;
      case "info":
        toast.info(message,options);
        break;
      case "warning":
        toast.warn(message,options);
        break;
      default:
        toast(message,options);
        break;
    }
  };

  return showToast;
};

export default useToastify;
