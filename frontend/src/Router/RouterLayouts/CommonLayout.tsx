import { FC, ReactNode } from "react";
import { Navigation } from "../../components/Navigation.tsx";

type CommonLayoutProps = {
  children: ReactNode;
};
export const CommonLayout: FC<CommonLayoutProps> = ({ children }) => (
  <div>
    <Navigation />
    <div className="main-content">{children}</div>
  </div>
);
