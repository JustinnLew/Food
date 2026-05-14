import NavBarLanding from "../components/NavBarLanding";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IngredientSearch from "../components/IngredientSearch";
import { DIFFICULTY, type Ingredient, type Recipe } from "../interface";
import { useEffect, useState } from "react";
import AuthFetch from "../auth/AuthFetch";
import LinkIcon from "../icons/LinkIcon";
import { Link } from "react-router-dom";
import Difficulty from "../components/createrecipe/Difficulty";
import CookingTime from "../components/createrecipe/CookingTime";

type QueryMode = "strict" | "relaxed" | "random";

const MODES: { label: string; value: QueryMode }[] = [
  { label: "Strict", value: "strict" },
  { label: "Relaxed", value: "relaxed" },
  { label: "Random", value: "random" },
];

export default function Landing() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [amountInputs, setAmountInputs] = useState<Record<number, string>>({});
  const [recipeCache, setRecipeCache] = useState<
    Partial<Record<QueryMode, Recipe[]>>
  >({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<QueryMode>("random");
  const [timeFilter, setTimeFilter] = useState(180);
  const [difficultyFilter, setDifficultyFilter] = useState(2);
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("pantry") || "[]");
    } catch {
      return [];
    }
  });

  const fetchRecipes = async (m: QueryMode) => {
    setLoading(true);
    try {
      const res = await AuthFetch({
        // Need to add userId for possible rate limiting in the future
        path: `http://127.0.0.1:3000/api/recipe/query`,
        method: "POST",
        body: {
          mode: m,
          page: 1,
          ingredients: ingredients.map((i) => ({
            id: i.id,
            amount: i.amount,
            unit: i.unit || i.default_unit,
          })),
          time: timeFilter,
          difficulty: difficultyFilter,
        },
      });
      const data = await res.json();
      setRecipeCache((prev) => ({ ...prev, [m]: data }));
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(mode);
  }, []);

  useEffect(() => {
    localStorage.setItem("pantry", JSON.stringify(ingredients));
    setRecipeCache({});
  }, [ingredients]);

  useEffect(() => {
    console.log(mode);
    if (mode !== "random") {
      setRecipeCache({});
      fetchRecipes(mode);
    }
  }, [ingredients, difficultyFilter]);
  // Add cooking time to this, but add a seperate state for input to avoid repeated calls to db

  const onSelectHandler = (ingredient: Ingredient) => {
    setIngredients((prev) => {
      if (prev.find((i) => i.id === ingredient.id)) return prev;
      ingredient.amount = 1;
      ingredient.unit = ingredient.default_unit;
      return [...prev, ingredient];
    });
  };

  const changeUnit = (id: number, unit: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unit } : item)),
    );
  };

  const setAmount = (id: number, amount: number) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: amount } : item)),
    );
  };

  const removeIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleModeChange = async (m: QueryMode) => {
    setMode(m);
    if (!recipeCache[m]) {
      await fetchRecipes(m);
    } else {
      setRecipes(recipeCache[m]);
    }
  };

  const handleAmountChange = (id: number, raw: string) => {
    setAmountInputs((prev) => ({ ...prev, [id]: raw }));
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) setAmount(id, parsed);
  };

  const handleAmountBlur = (id: number) => {
    setAmountInputs((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full font-display bg-background">
      <NavBarLanding />
      <div className="flex flex-col m-6 h-full gap-6">
        {/* Pantry */}
        <Accordion className="w-full p-1 bg-surface border rounded-md border-green-muted text-cream mb-0">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#e8dfc8" }} />}
            aria-controls="pantry-content"
            id="pantry-header"
          >
            <h1 className="text-3xl text-cream">Your Collection</h1>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-6">
            <div className="w-full border-cream/40" />
            <IngredientSearch onSelectHandler={onSelectHandler} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ingredients.map((i) => (
                <div
                  key={i.id}
                  className="flex bg-surface2 border border-green-muted hover:border-green transition-all duration-200 rounded-lg p-3"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h1 className="tracking-wider text-lg">{i.name}</h1>
                      <button
                        onClick={() => removeIngredient(i.id)}
                        className="text-cream-dim hover:text-red-300 cursor-pointer text-xl font-bold leading-none"
                      >
                        X
                      </button>
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="flex gap-2 text-cream-dim text-sm">
                        <input
                          type="number"
                          min={0}
                          value={amountInputs[i.id] ?? i.amount}
                          onChange={(e) =>
                            handleAmountChange(i.id, e.target.value)
                          }
                          onBlur={() => handleAmountBlur(i.id)}
                          className="w-16 bg-surface border border-green-muted rounded px-2 py-0.5 text-cream text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {i.supported_units?.length > 1 ? (
                          <select
                            value={i.unit}
                            onChange={(e) => changeUnit(i.id, e.target.value)}
                            className="bg-surface border border-green-muted rounded px-1 py-0.5 text-cream text-sm cursor-pointer"
                          >
                            {i.supported_units.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{i.unit}</span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setAmount(i.id, i.amount + 1)}
                          className="text-2xl font-bold hover:text-blue-300 cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setAmount(i.id, i.amount - 1)}
                          className="text-2xl font-bold hover:text-red-300 cursor-pointer"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-md p-5 bg-surface border border-green-muted text-cream">
          <div className="flex flex-col gap-3">
              <h1 className="text-3xl">Filters</h1>
              <div className="flex gap-8 p-4 bg-surface2 border border-green-muted rounded-md w-full md:w-2/3">
                <Difficulty
                  setDifficulty={setDifficultyFilter}
                  difficulty={difficultyFilter}
                />
                <div className="border-l border-green-muted h-full" />
                <CookingTime
                  setCookTimeMins={setTimeFilter}
                  cookTimeMins={timeFilter}
                />
              </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="flex flex-col gap-4 rounded-md p-5 bg-surface border border-green-muted text-cream">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h1 className="text-3xl">Recommendations</h1>
            {/* Mode tabs */}
            <div className="flex border border-green-muted rounded-lg overflow-hidden w-fit">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => handleModeChange(m.value)}
                  className={`px-4 py-1.5 text-sm tracking-wide transition-colors duration-150 cursor-pointer
                    ${
                      mode === m.value
                        ? "bg-green-muted text-cream"
                        : "text-cream-dim hover:text-cream hover:bg-surface2"
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-cream-dim">
              Loading...
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-cream-dim">
              No recipes found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col border border-green-muted rounded-lg overflow-hidden h-120"
                >
                  {r.image_src ? (
                    <img
                      src={r.image_src}
                      className="h-2/3 w-full object-cover"
                      alt={r.title}
                    />
                  ) : (
                    <div className="h-2/3 w-full bg-surface2 flex items-center justify-center text-cream-dim">
                      No image
                    </div>
                  )}
                  <div className="flex-1 flex flex-col px-5 py-4 justify-between gap-2">
                    <div className="flex gap-2 text-sm text-cream-dim">
                      <div>{Math.round(r.match_score * 100)}% match</div>
                      <div>·</div>
                      <div>
                        {r.ingredients?.length ?? 0} of{" "}
                        {(r.ingredients?.length ?? 0) +
                          (r.missing_ingredients?.length ?? 0) +
                          (r.insufficient_ingredients?.length ?? 0)}{" "}
                        ingredients
                      </div>
                      <Link
                        to={`/recipe/${r.id}`}
                        state={{ recipe: r }}
                        className="ml-auto cursor-pointer"
                      >
                        <LinkIcon size={18} fill="#e8dfc8" />
                      </Link>
                    </div>
                    <div className="text-2xl">{r.title}</div>
                    <div className="flex gap-6 text-cream-dim text-sm">
                      <div>{r.cook_time_mins} min</div>
                      <div>{DIFFICULTY[r.difficulty] ?? "Unknown"}</div>
                    </div>
                    {r.missing_ingredients && (
                      <div className="text-xs text-red-400 mt-1">
                        Missing:{" "}
                        {r.missing_ingredients
                          .map((m) => m.ingredient)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
