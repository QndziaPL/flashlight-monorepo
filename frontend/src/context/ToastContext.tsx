import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useSocketSubscription } from "./WebSocketContext.tsx";
import { toast } from "../@/components/ui/use-toast.ts";
import { useWelcomeMessage } from "../hooks/useWelcomeMessage.ts";

type ToastType = "error" | "info";
export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};
type ToastContextState = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
};
const ToastContext = createContext<ToastContextState>({} as ToastContextState);

export const ToastContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [error] = useSocketSubscription<"ERROR_MESSAGE">({ eventName: "ERROR_MESSAGE" });
  const [infoMessage] = useSocketSubscription<"INFO_MESSAGE">({ eventName: "INFO_MESSAGE" });

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => {
      const copy = [...prev];
      if (copy.length > 10) {
        copy.splice(0, 5);
      }
      return [...copy, toast];
    });
  }, []);

  useEffect(() => {
    if (error) {
      addToast({ id: error.id, message: error.message, type: "error" });
    }
  }, [error]);

  useEffect(() => {
    if (infoMessage) {
      addToast({ id: infoMessage.id, message: infoMessage.message, type: "info" });
    }
  }, [infoMessage]);

  useEffect(() => {
    if (toasts.length) {
      const { message, type } = toasts[toasts.length - 1];
      toast({
        description: message,
        variant: getToastVariantBasedOnType(type),
      });
    }
  }, [toasts]);

  useWelcomeMessage(addToast);

  return <ToastContext.Provider value={{ toasts, addToast }}>{children}</ToastContext.Provider>;
};

const getToastVariantBasedOnType = (type: ToastType) => {
  switch (type) {
    case "info":
      return "default";
    case "error":
      return "destructive";
  }
};

export const useToasts = () => useContext(ToastContext);
