import { FC, ReactNode } from "react";
import { Navigation } from "../../components/Navigation.tsx";
import { Toaster } from "../../@/components/ui/toaster.tsx";

type CommonLayoutProps = {
  children: ReactNode;
};
export const CommonLayout: FC<CommonLayoutProps> = ({ children }) => (
  <div>
    <Navigation />
    <div className="main-content">{children}</div>
    <Toaster />
  </div>
);
