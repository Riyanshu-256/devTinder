import { useSelector } from "react-redux";
import Toast from "./Toast";
import { useDispatch } from "react-redux";
import { removeToast } from "../utils/toastSlice";

const ToastContainer = () => {
  const toasts = useSelector((store) => store.toast?.toasts || []);
  const dispatch = useDispatch();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(removeToast(toast.id))}
          duration={toast.duration}
        />
      ))}
    </>
  );
};

export default ToastContainer;


