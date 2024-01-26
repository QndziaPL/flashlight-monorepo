import { FC } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { Navigate, Outlet } from "react-router";
import { CommonLayout } from "./CommonLayout.tsx";

export const ProtectedLayout: FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};
