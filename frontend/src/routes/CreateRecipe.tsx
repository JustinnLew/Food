import { useState } from "react";
import AuthFetch from "../auth/AuthFetch";
import { useSession } from "../auth/SessionContext";
import type { Ingredient, RecipeInstruction } from "../interface";
import NavBarLanding from "../components/NavBarLanding";
import CookingTime from "../components/createrecipe/CookingTime";
import Difficulty from "../components/createrecipe/Difficulty";
import RecipeName from "../components/createrecipe/RecipeName";
import Instructions from "../components/createrecipe/Instructions";
import Ingredients from "../components/createrecipe/Ingredients";

export default function CreateRecipe() {
  const { session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [cookTimeMins, setCookTimeMins] = useState<number>(30);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<RecipeInstruction[]>([
    {
      text: "",
      timer: 1,
    },
  ]);

  const submitRecipe = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await AuthFetch({
      path: `http://127.0.0.1:3000/api/create-recipe`,
      method: "POST",
      body: {
        author: session?.user.id,
        title: title,
        difficulty: difficulty,
        cook_time_minutes: cookTimeMins,
        instructions: instructions.map((inst, index) => ({
          step: index + 1,
          text: inst.text,
          timer: inst.timer,
        })),
        ingredients: ingredients.map((i) => ({
          id: i.id,
          amount: i.amount,
          unit: i.unit,
        })),
      },
    });
    if (res.ok) {
      const newId = await res.json();
      console.log(`Recipe #${newId} created successfully!`);
    } else {
      alert("Something went wrong on the server.");
    }
  };

  const onIngredientSelect = (ingredient: Ingredient) => {
    if (ingredients.some((i) => i.id === ingredient.id)) {
      return;
    }
    setIngredients([
      ...ingredients,
      { ...ingredient, amount: 1, unit: ingredient.default_unit },
    ]);
  };

  const onIngredientDelete = (ing_id: number) => {
    setIngredients(ingredients.filter((i) => i.id !== ing_id));
  };

  const addNewInstruction = () => {
    setInstructions([...instructions, { text: "", timer: 1 }]);
  };

  const removeInstruction = (index: number) => {
    const modified = [...instructions];
    modified.splice(index, 1);

    setInstructions(modified);
  };

  const setInstructionTimer = (index: number, input: number) => {
    setInstructions(
      instructions.map((item, i) =>
        i === index ? { ...item, timer: input } : item,
      ),
    );
  };

  const updateInstructionText = (index: number, input: string) => {
    setInstructions(
      instructions.map((item, i) =>
        i === index ? { ...item, text: input } : item,
      ),
    );
  };

  const updateIngredientAmount = (ing_id: number, amount: number) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === ing_id ? { ...ing, amount: amount } : ing,
      ),
    );
  };

  const updateIngredientUnit = (ing_id: number, unit: string) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === ing_id ? { ...ing, unit: unit } : ing,
      ),
    );
  };

  return (
    <>
      <NavBarLanding />
      <div className="w-full flex flex-col items-center justify-center border scroll-smooth">
        <form
          className="flex flex-col w-1/2 border"
          onSubmit={(e) => submitRecipe(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <h1 className="self-center">Page Title</h1>
          <RecipeName setTitle={setTitle} title={title} />
          <h2>Details</h2>
          <div className="flex">
            <Difficulty setDifficulty={setDifficulty} difficulty={difficulty} />
            <CookingTime
              setCookTimeMins={setCookTimeMins}
              cookTimeMins={cookTimeMins}
            />
          </div>
          <h2>Ingredients</h2>
          <Ingredients
            onIngredientSelect={onIngredientSelect}
            updateIngredientAmount={updateIngredientAmount}
            updateIngredientUnit={updateIngredientUnit}
            onIngredientDelete={onIngredientDelete}
            ingredients={ingredients}
          />
          <h2>Instructions</h2>
          <Instructions
            updateInstructionText={updateInstructionText}
            setInstructionTimer={setInstructionTimer}
            removeInstruction={removeInstruction}
            addNewInstruction={addNewInstruction}
            instructions={instructions}
          />
          <button type="submit" className="self-end">
            Create Recipe!
          </button>
        </form>
      </div>
    </>
  );
}
