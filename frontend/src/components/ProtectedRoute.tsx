import { FC, ReactNode } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { Navigate } from "react-router";

type ProtectedRouteProps = { children: ReactNode };
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return children;
};
