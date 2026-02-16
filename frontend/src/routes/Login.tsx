import { useState } from "react";
import { useSession } from "../auth/SessionContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useSession();
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Logging in with email:", email, "and password:", password);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="h-screen flex-col w-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 border border-white p-8 rounded-xl w-4/5 sm:w-1/2 lg:w-1/3"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="flex flex-col gap-5 my-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="block p-3 border border-gray-300 rounded"
            onBlur={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="block p-3 border border-gray-300 rounded"
            onBlur={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-green-500 py-2 cursor-pointer"
          onSubmit={handleLogin}
        >
          &gt;&gt;&gt;
        </button>
      </form>
      <div className="mt-6 flex gap-3">
        <p>Dont have an account?</p>
        <a href="/signup" className="text-blue-300 hover:underline">
          Sign Up
        </a>
      </div>
    </div>
  );
}
