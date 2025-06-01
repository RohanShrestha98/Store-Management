import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";

const RequireAuth = () => {
  // const { loggedIn } = useAuthStore();
  const loggedIn = true
  const location = useLocation();
  return loggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
