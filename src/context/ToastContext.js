import { createContext, useContext } from "react";
import { toast } from "sonner";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // duration (ms) is optional (v1.87.0): a message that needs reading - such
  // as "Contact created, but the account was not" - can stay up longer than
  // the 3-second default set on the Toaster.
  const showToast = ({
    title,
    description,
    type = "success",
    duration,
  }) => {
    const options = duration ? { description, duration } : { description };
    switch (type) {
      case "success":
        toast.success(title, options);
        break;

      case "error":
        toast.error(title, options);
        break;

      case "warning":
        toast.warning(title, options);
        break;

      case "info":
        toast.info(title, options);
        break;

      default:
        toast(title, options);
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