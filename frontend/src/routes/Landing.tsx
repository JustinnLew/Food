import NavBarLanding from "../components/NavBarLanding";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IngredientSearch from "../components/IngredientSearch";
import type { Ingredient } from "../interface";
import { useEffect, useState } from "react";

export default function Landing() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const onSelectHandler = (ingredient: Ingredient) => {
    setIngredients((prev) => {
      if (prev.find((i) => i.id === ingredient.id)) return prev;
      ingredient.amount = 0;
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
    if (ingredients.length > 0) {
      localStorage.setItem("pantry", JSON.stringify(ingredients));
    }
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
    <div className="flex flex-col min-h-screen w-screen bg-gray-100">
      <NavBarLanding />
      <div className="flex flex-col m-6 h-full">
        <Accordion className="w-full p-1">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={"pantry-content"}
            id={"pantry-header"}
          >
            <h1 className="text-xl font-bold">Your Collection</h1>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-">
            <IngredientSearch onSelectHandler={onSelectHandler} />
            <div className="border border-gray-300 my-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Ingredient card here */}
              {ingredients.map((i) => (
                <div
                  className="flex border border-gray-300 rounded-lg p-3"
                  key={i.id}
                >
                  <div className="flex-1 flex-col ">
                    <h1>{i.name}</h1>
                    <p>{i.amount}</p>
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
        <div className="flex flex-col gap-4 mt-4 border border-gray-300 rounded-lg p-3">
          <h1 className="text-xl font-bold">Recommendations</h1>
          <div className="flex gap-6 h-64">
            <div className="flex-1 flex-col border border-gray-300 rounded-md p-3"></div>
            <div className="flex-1 flex-col border border-gray-300 rounded-md p-3"></div>
            <div className="flex-1 flex-col border border-gray-300 rounded-md p-3"></div>
          </div>
          <div className="self-center">RR</div>
        </div>
      </div>
    </div>
  );
}
