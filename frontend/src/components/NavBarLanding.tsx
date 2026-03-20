import { useNavigate } from "react-router-dom";
import { useSession } from "../auth/SessionContext";
import HomeIcon from "../icons/HomeIcon";
import CreateRecipeIcon from "../icons/CreateRecipeIcon";
import Tooltip from "@mui/material/Tooltip";

export default function NavBarLanding() {
  const navigate = useNavigate();
  const { signOut } = useSession();

  return (
    <nav className="bg-green-500/20 p-6 w-full items-center flex gap-2">
      <Tooltip title="Home" arrow>
        <button
          className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
          onClick={() => navigate("/landing")}
        >
          <HomeIcon size={28} fill="black" />
        </button>
      </Tooltip>

      <h1 className="flex-1 font-semibold">Welcome to WhatToCook</h1>

      <div className="flex gap-6">
        <Tooltip title="Create New Recipe" placement="bottom" arrow>
          <button
            className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={() => navigate("/create-recipe")}
          >
            <CreateRecipeIcon size={32} />
          </button>
        </Tooltip>

        <button
          onClick={signOut}
          className="text-zinc-900 rounded hover:text-blue-500 transition-colors cursor-pointer duration-200 hover:scale-105 active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
