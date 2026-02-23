import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "./SessionContext";
import LoadingSpinner from "../routes/LoadingSpinner";

export default function AuthenticatedRoute() {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
