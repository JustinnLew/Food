import { Navigate } from "react-router-dom";
import { useSession } from "../auth/SessionContext";
import NavBar from "../components/NavBarHome";
import LoadingSpinner from "./LoadingSpinner";

export default function Home() {
  const { session, loading } = useSession();

  if (loading) {
      return <LoadingSpinner />;
    }

    if (session) {
      return <Navigate to="/landing" replace />;
    }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col">
      <NavBar />
    </div>
  );
}
