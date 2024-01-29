import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { v4 } from "uuid";
import { Toast } from "../context/ToastContext.tsx";

export const useWelcomeMessage = (addToast: (toast: Toast) => void) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      addToast({
        id: v4(),
        type: "info",
        message: `Welcome, ${user.email}! It's nice to see you!`,
      });
    }
  }, [user]);
};
