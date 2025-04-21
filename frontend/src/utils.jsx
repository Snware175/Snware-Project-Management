import { toast } from "react-toastify";

export const handleSuccess = (msg, id = undefined) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};
