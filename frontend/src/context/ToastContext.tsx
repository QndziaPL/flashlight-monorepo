import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { useSocketSubscription } from "./WebSocketContext.tsx";
import { toast } from "../@/components/ui/use-toast.ts";

type Toast = {
  id: string;
  message: string;
};
type ToastContextState = {
  toasts: Toast[];
};
const ToastContext = createContext<ToastContextState>({} as ToastContextState);

export const ToastContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [error] = useSocketSubscription<"ERROR_MESSAGE">({ eventName: "ERROR_MESSAGE" });

  useEffect(() => {
    if (error) {
      setToasts((prev) => [...prev, { id: error.id, message: error.message }]);
    }
  }, [error]);

  useEffect(() => {
    if (toasts.length) {
      toast({
        description: toasts[toasts.length - 1].message,
      });
    }
  }, [toasts]);

  console.log(error, toasts);

  return <ToastContext.Provider value={{ toasts }}>{children}</ToastContext.Provider>;
};

export const useToasts = () => useContext(ToastContext);
