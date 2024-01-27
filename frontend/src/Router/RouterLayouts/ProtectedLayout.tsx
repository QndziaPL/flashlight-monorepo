import { FC, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router";
import { CommonLayout } from "./CommonLayout.tsx";
import { useToasts } from "../../context/ToastContext.tsx";

export const ProtectedLayout: FC = () => {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    if (location.state?.toast) {
      addToast(location.state.toast);
    }
  }, [location, addToast]);

  if (!user) return <Navigate to="/login" />;

  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};
