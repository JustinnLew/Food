import { useNavigate } from "react-router-dom";
import { useSession } from "../auth/SessionContext";
import HomeIcon from "../icons/HomeIcon";
import CreateRecipeIcon from "../icons/CreateRecipeIcon";
import Tooltip from "@mui/material/Tooltip";

export default function NavBarLanding() {
  const navigate = useNavigate();
  const { signOut } = useSession();

  return (
    <nav
      className="bg-background p-6 w-full justify-center flex gap-6 border-b-green-muted border-b"
      style={{
        wordSpacing: "0.25em",
      }}
    >
      <Tooltip title="Home" arrow>
        <button
          className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
          onClick={() => navigate("/landing")}
        >
          <HomeIcon size={24} fill="#e8dfc8" />
        </button>
      </Tooltip>

      <h1 className="flex-1 text-cream text-3xl tracking-nav">
        Welcome to WhatToCook
      </h1>

      <div className="flex gap-6">
        <Tooltip title="Create New Recipe" placement="bottom" arrow>
          <button
            className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={() => navigate("/create-recipe")}
          >
            <CreateRecipeIcon size={32} fill="#e8dfc8" />
          </button>
        </Tooltip>

        <button
          onClick={signOut}
          className="text-cream text-xl rounded transition-colors cursor-pointer duration-200 hover:scale-105 active:scale-95 border px-3 py-1
          hover:bg-green hover:text-surface border-green-muted"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
