import { useSession } from "../auth/SessionContext";

export default function NavBarLanding() {
  const { signOut } = useSession();

  return (
    <nav className="bg-green-500/20 p-6 w-full items-center flex">
      <h1 className="flex-1 font-semibold">Welcome to WhatToCook</h1>
      <button
        onClick={signOut}
        className="text-zinc-900 rounded hover:text-blue-500 transition-colors"
      >
        Sign Out
      </button>
    </nav>
  );
}
