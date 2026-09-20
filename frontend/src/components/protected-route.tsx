import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  children?: ReactElement;
  adminOnly?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  isAdmin,
  redirect = "/",
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if (adminOnly && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
