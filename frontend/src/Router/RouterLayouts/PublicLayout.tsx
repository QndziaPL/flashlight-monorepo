import { useAuth } from "../../context/AuthContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router";
import { ProtectedPaths, PublicPaths } from "../RouterPaths.ts";
import { withBackslash } from "../helpers.ts";
import { CommonLayout } from "./CommonLayout.tsx";

export const PublicLayout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const onHome = pathname === withBackslash(PublicPaths.HOME);

  if (user && !onHome) {
    return <Navigate to={ProtectedPaths.LOBBY_LIST} replace />;
  }

  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};
