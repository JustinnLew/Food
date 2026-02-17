import { Navigate } from "react-router-dom";
import { useSession } from "../auth/SessionContext";
import NavBarLanding from "../components/NavBarLanding";
import LoadingSpinner from "./LoadingSpinner";

export default function Landing() {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    // Change this to a NOTFOUND later
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col">
      <NavBarLanding />
    </div>
  );
}
