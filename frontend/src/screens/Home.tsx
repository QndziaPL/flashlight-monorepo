import { Outlet, useLocation } from "react-router";
import { Link } from "react-router-dom";

export const Home = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  return (
    <div>
      <h1>Wykurwiaszcza giera</h1>
      <Outlet />
      {onHome && (
        <div>
          <Link to="login">Login</Link>
          <Link to="register">Register</Link>
        </div>
      )}
      <footer>{!onHome && <Link to="/">Home page</Link>}</footer>
    </div>
  );
};
