import { useEffect, useState } from "react";
import AuthFetch from "../auth/AuthFetch";
import { useSession } from "../auth/SessionContext";
import NavBar from "../components/NavBarHome";
import IngredientSearch from "../components/IngredientSearch";
import type { Ingredient } from "../interface";
import NavBarLanding from "../components/NavBarLanding";

interface RecipeInstruction {
  text: string;
  timer: number;
}

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

  const submitRecipe = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Title: ", title);
    console.log("Difficulty: ", difficulty);
    console.log("CookTime: ", cookTimeMins);
    console.log("Ingredients: ", ingredients);
    console.log("Instructions: ", instructions);
  };
  // const submitRecipe = async () => {
  //     const res = await AuthFetch({
  //         path: `http://127.0.0.1:3000/api/create-recipe`,
  //         method: "POST",
  //         body: {
  //             author: session?.user.id,
  //             title: "TEST",
  //             difficulty: 1,
  //             cook_time_minutes: 30,
  //             instructions: [
  //                 { step: 1, text: "Boil water with salt", timer: 10 },
  //                 { step: 2, text: "Cook pasta until al dente", timer: 8 }
  //             ],
  //             ingredients: [{id: 1, amount: 10, unit: "Kg"}]
  //         }
  //     }
  //     );
  //     if (res.ok) {
  //         const newId = await res.json();
  //         console.log(`Recipe #${newId} created successfully!`);
  //     } else {
  //         alert("Something went wrong on the server.");
  //     }
  // }

  const difficulties = [
    { id: 1, type: "Easy" },
    { id: 2, type: "Medium" },
    { id: 3, type: "Hard" },
  ];

  const onIngredientSelect = (ingredient: Ingredient) => {
    if (ingredients.some((i) => i.id === ingredient.id)) {
      return;
    }
    setIngredients([...ingredients, ingredient]);
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

  return (
    <>
      <NavBarLanding />
      {/* <button
                onClick={submitRecipe}
            >YPIEEE</button> */}
      <div className="w-full flex flex-col items-center justify-center border scroll-smooth">
        <form
          className="flex flex-col w-1/2 border"
          onSubmit={(e) => submitRecipe(e)}
        >
          <h1 className="self-center">Page Title</h1>
          <label className="flex flex-col">
            Recipe Name
            <input
              id="title"
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-1/2"
            />
          </label>
          <h2>Details</h2>
          <div className="flex">
            <label className="flex flex-col flex-1">
              Difficulty
              <div className="flex">
                {difficulties.map((d) => {
                  return (
                    <button
                      key={d.id}
                      className={`flex-1 cursor-pointer border ${difficulty === d.id ? "border-red-500 border" : "border-gray-300"}`}
                      onClick={() => setDifficulty(d.id)}
                    >
                      {d.type}
                    </button>
                  );
                })}
              </div>
            </label>
            <label className="flex flex-col">
              Cooking Time
              <div className="flex">
                <input id="cook-time-mins" type="number" min="1" onChange={(e) => setCookTimeMins(parseInt(e.target.value))} />
                min
              </div>
            </label>
          </div>
          <h2>Ingredients</h2>
          <div>
            <IngredientSearch onSelectHandler={onIngredientSelect} />
            <div className="flex flex-col">
              {ingredients.map((ing) => {
                return (
                  <div key={ing.id} className="flex">
                    <h3>{ing.name}</h3>
                    <input type="number" value={ing.amount} placeholder="Qty" />
                    <select></select>
                    <button
                      type="button"
                      onClick={() => onIngredientDelete(ing.id)}
                      className="self-center justify-self-center cursor-pointer"
                    >
                      x
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <h2>Instructions</h2>
          <div className="flex flex-col">
            {instructions.map((inst, index) => {
              return (
                <div key={index} className="flex gap-3">
                  <h3>{index + 1}</h3>
                  <textarea
                    className="flex-1"
                    placeholder={"Describe this step..."}
                    value={inst.text}
                    onChange={(e) =>
                      updateInstructionText(index, e.target.value)
                    }
                  ></textarea>
                  <label className="flex flex-col">
                    Timer (min)
                    <input
                      type="number"
                      value={inst.timer}
                      onChange={(e) => {
                        e.preventDefault();
                        setInstructionTimer(index, parseInt(e.target.value));
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => removeInstruction(index)}
                  >
                    x
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addNewInstruction}
              className="w-full"
            >
              {" "}
              + add step
            </button>
          </div>
          <button type="submit" className="self-end">
            Create Recipe!
          </button>
        </form>
      </div>
    </>
  );
}
