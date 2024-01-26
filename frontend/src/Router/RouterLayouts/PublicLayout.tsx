import { useAuth } from "../../context/AuthContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router";
import { ProtectedPaths, PublicPaths } from "../RouterPaths.ts";
import { withBackslash } from "../helpers.ts";
import { CommonLayout } from "./CommonLayout.tsx";

export const PublicLayout = () => {
  const { user } = useAuth();

  const { pathname } = useLocation();
  console.log(pathname);
  const onHome = pathname === withBackslash(PublicPaths.HOME);
  console.log(onHome);

  if (user && !onHome) {
    return <Navigate to={ProtectedPaths.LOBBYS} replace />;
  }

  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
};
