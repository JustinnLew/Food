import { useState } from "react";
import { useSession } from "../auth/SessionContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAuthApiError, isAuthWeakPasswordError } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

export default function SignUp() {
  const { session, signUp, loading } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (session) {
    return <Navigate to="/landing" replace />;
  }

  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password);
      navigate("/");
    } catch (err: any) {
      if (isAuthApiError(err)) {
        if (err.code === "user_already_exists") {
          setError("An account with this email already exists.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else if (isAuthWeakPasswordError(err)) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-6 border border-zinc-800 p-8 rounded-xl w-full max-w-md bg-zinc-900/50"
      >
        <div className="flex gap-3 ">
          <h1 className="flex-1 text-3xl font-bold">Create Account</h1>
          <Link
            to="/"
            className="text-2xl font-bold cursor-pointer hover:text-zinc-300"
          >
            &lt;
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 items-center border border-red-500/50 bg-red-500/10 rounded-lg p-4"
            >
              <p className="text-red-400 text-sm flex-1">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-zinc-400"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              className="block p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-zinc-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="block p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-zinc-400"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="block p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`rounded-lg py-3 font-semibold transition-all
            ${
              loading
                ? "bg-zinc-700 cursor-not-allowed text-zinc-400"
                : "bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white"
            }`}
        >
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>

      <div className="mt-6 flex gap-3 text-zinc-400">
        <p>Already have an account?</p>
        <Link to="/login" replace className="text-blue-300 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
