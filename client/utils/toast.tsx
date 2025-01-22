import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Success toast
export const showSuccessToast = (message: string, options = {}) => {
  toast.success(message, {
    position: "bottom-left",
    autoClose: 2500,
    ...options,
  });
};

// Error toast
export const showErrorToast = (message: string, options = {}) => {
  toast.error(message, {
    position: "bottom-left",
    autoClose: 2500,
    ...options,
  });
};

// Info toast
export const showInfoToast = (message: string, options = {}) => {
  toast.info(message, {
    position: "bottom-left",
    autoClose: 2500,
    ...options,
  });
};

// Warning toast
export const showWarningToast = (message: string, options = {}) => {
  toast.warn(message, {
    position: "bottom-left",
    autoClose: 2500,
    ...options,
  });
};

// Custom styled toast
export const showCustomToast = (message: string, style = {}, options = {}) => {
  toast(message, {
    style: {
      backgroundColor: "#282c34",
      color: "#61dafb",
      fontSize: "20px",
      borderRadius: "10px",
      ...style,
    },
    position: "bottom-left",
    autoClose: 2500,
    ...options,
  });
};
