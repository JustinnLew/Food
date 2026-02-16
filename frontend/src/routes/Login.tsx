import { useState } from "react";
import { useSession } from "../auth/SessionContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthApiError } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      if (isAuthApiError(error)) {
        if (error.code === "invalid_credentials") {
          setError("Invalid email or password. Please try again");
        } else if (error.code === "over_request_rate_limit"){
          setError("Too many login attempts. Wait a moment and try again");
        }
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };

  return (
    <div className="h-screen flex-col w-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 border border-white p-8 rounded-xl w-4/5 sm:w-1/2 lg:w-1/3"
      >
        <h1 className="text-2xl font-bold">Login</h1>
          {error &&
          <div className="flex gap-3 items-center border border-red-500 rounded-lg p-4">
            <p className="text-red-500 flex-1">{error}</p>
            <p onClick={() => setError(null)} className="text-white cursor-pointer font-bold">X</p>
          </div>}
        <div className="flex flex-col gap-5 my-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="block p-3 border border-gray-300 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="block p-3 border border-gray-300 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`rounded py-2
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500  cursor-pointer"}`}
        >
          {loading ? "Logging in..." : ">>>"}
        </button>
      </form>
      <div className="mt-6 flex gap-3">
        <p>Dont have an account?</p>
        <Link to="/signup" className="text-blue-300 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
