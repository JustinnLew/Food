import { Navigate } from "react-router-dom";
import { useSession } from "../auth/SessionContext"

export default function Landing() {
    const { session, signOut } = useSession();

    if (!session) {
        // Change this to a NOTFOUND later
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <h1 className="text-4xl font-bold">Welcome!!</h1>
            <button
                onClick={signOut}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Sign Out
            </button>
        </div>
    )
}