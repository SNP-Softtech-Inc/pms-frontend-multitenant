import { createContext, useContext } from "react";
import { toast } from "sonner";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = ({
    title,
    description,
    type = "success",
  }) => {
    switch (type) {
      case "success":
        toast.success(title, { description });
        break;

      case "error":
        toast.error(title, { description });
        break;

      case "warning":
        toast.warning(title, { description });
        break;

      case "info":
        toast.info(title, { description });
        break;

      default:
        toast(title, { description });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  return useContext(ToastContext);
};