import NavBarLanding from "../components/NavBarLanding";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IngredientSearch from "../components/IngredientSearch";
import type { Ingredient, Recipe } from "../interface";
import { useEffect, useState } from "react";
import AuthFetch from "../auth/AuthFetch";

export default function Landing() {
  const [recipes, setRecipes] = useState<Recipe[]>();
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem("pantry");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  });

  useEffect(() => {
    const initRecipes = async () => {
      const res = await AuthFetch({
        path: `http://127.0.0.1:3000/api/recipe/query`,
        method: "POST",
        body: {
          mode: "random",
          page: 1,
          ingredients: ingredients.map((i) => ({
            id: i.id,
            amount: i.amount,
            unit: i.unit || i.default_unit,
          })),
          time: 30,
          difficulty: 2,
        },
      });
      const data = await res.json();
      console.log(data);
    };
    initRecipes();
  }, []);

  const onSelectHandler = (ingredient: Ingredient) => {
    setIngredients((prev) => {
      if (prev.find((i) => i.id === ingredient.id)) return prev;
      ingredient.amount = 1;
      ingredient.unit = ingredient.default_unit;
      return [...prev, ingredient];
    });
  };

  const incrementAmount = (id: number) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: (item.amount || 0) + 1 } : item,
      ),
    );
  };

  const decrementAmount = (id: number) => {
    setIngredients((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return item;

        const newAmount = (item.amount ?? 0) - 1;

        return newAmount > 0 ? { ...item, amount: newAmount } : [];
      }),
    );
  };

  useEffect(() => {
    localStorage.setItem("pantry", JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    const savedIngredients = localStorage.getItem("pantry");
    if (savedIngredients) {
      try {
        setIngredients(JSON.parse(savedIngredients));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen font-display bg-background">
      <NavBarLanding />
      <div className="flex flex-col m-6 h-full">
        <Accordion className="w-full p-1 bg-surface border border-green-muted text-cream">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#e8dfc8" }} />}
            aria-controls={"pantry-content"}
            id={"pantry-header"}
          >
            <h1 className="text-3xl text-cream">Your Collection</h1>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-6">
            <div className="w-full border-b border-cream/40" />
            <IngredientSearch onSelectHandler={onSelectHandler} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Ingredient card here */}
              {ingredients.map((i) => (
                <div
                  className="flex bg-surface2 border border-green-muted hover:border-green transition-all duration-200 rounded p-3"
                  key={i.id}
                >
                  <div className="flex-1 flex-col ">
                    <h1 className="tracking-wider text-lg">{i.name}</h1>
                    <div className="flex gap-1 text-cream-dim text-md">
                      <p className="tracking-wide">x{i.amount}</p>
                      <p className="tracking-widest">{i.unit}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <button
                      onClick={() => incrementAmount(i.id)}
                      className="text-2xl font-bold hover:text-blue-300 cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      onClick={() => decrementAmount(i.id)}
                      className="text-2xl font-bold hover:text-red-300 cursor-pointer"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
        <div className="flex flex-col gap-4 mt-4 rounded-lg p-5 bg-surface border border-green-muted text-cream">
          <h1 className="text-3xl">Recommendations</h1>
          <div className="flex gap-6 h-120">
            <div className="flex-1 flex flex-col border border-green-muted rounded-md">
              <img
                src="https://myfoodbook.com.au/sites/default/files/styles/schema_img/public/recipe_photo/Spaghetti_Bolognese%20Sauce_0.jpeg"
                className="h-2/3 w-full object-cover"
              />
              <div className="flex-1 flex flex-col px-5 py-4 justify-between">
                <div className="flex gap-2">
                  <div className="">98% match</div>
                  <div>·</div>
                  <div>4 of 5 ingredients</div>
                </div>
                <div className="text-3xl">Spaghetti Bolognese</div>
                <div className="flex gap-6 text-cream-dim text-lg">
                  <div>20 min</div>
                  <div>Easy</div>
                  <div>2 servings</div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex-col border border-gray-300 rounded-md p-3"></div>
            <div className="flex-1 flex-col border border-gray-300 rounded-md p-3"></div>
          </div>
          <div className="self-center">Refresh?</div>
        </div>
      </div>
    </div>
  );
}
