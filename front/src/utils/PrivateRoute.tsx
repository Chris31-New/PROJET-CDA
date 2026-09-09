import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useRefreshToken } from "../hooks/use-auth.service";

type Props = {
  allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const { isLoading, isError } = useRefreshToken();

  if (allowedRoles) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }
  if (accessToken) return <Outlet />;

  if (isLoading) return <div>Chargement...</div>;

  if (isError) return <Navigate to="/signin" replace />;

  return <Outlet />;
}
