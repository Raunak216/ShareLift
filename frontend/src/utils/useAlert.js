import { useState } from "react";

const useAlert = (duration = 3000) => {
  const [alertState, setAlertState] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, isVisible: false }));
  };

  const displayAlert = (message, type) => {
    clearTimeout(alertState.timerId);
    setAlertState({
      isVisible: true,
      message,
      type,
      timerId: setTimeout(hideAlert, duration),
    });
  };

  useState(() => {
    return () => clearTimeout(alertState.timerId);
  }, [alertState.timerId]);
  return { alertState, displayAlert, hideAlert };
};

export default useAlert;
