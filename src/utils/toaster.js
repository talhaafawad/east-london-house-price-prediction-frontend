import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toasterConfigurations = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 3000, // 3 seconds
};

const showSuccessToaster = (message, config = toasterConfigurations) => {
  toast.success(message, config);
};

const showFailureToaster = (message, config = toasterConfigurations) => {
  toast.error(message, config);
};

export { showSuccessToaster, showFailureToaster };
