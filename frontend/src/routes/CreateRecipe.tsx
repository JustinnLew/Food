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
  const [imageSrc, setImageSrc] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [cookTimeMins, setCookTimeMins] = useState<number>(30);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<RecipeInstruction[]>([
    {
      text: "",
      timer: 1,
    },
  ]);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [serves, setServes] = useState<number>(1);

  const submitRecipe = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await AuthFetch({
      path: `http://127.0.0.1:3000/api/recipe/create`,
      method: "POST",
      body: {
        author: session?.user.id,
        title: title,
        image_src: imageSrc,
        difficulty: difficulty,
        cook_time_minutes: cookTimeMins,
        description: description,
        tags: tags.map((tag) => tag.trim()),
        serves: serves,
        instructions: instructions.map((inst) => ({
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
      setSuccessId(newId);
      setError(false);
      setTimeout(() => setSuccessId(null), 4000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 4000);
    }
  };

  const onIngredientSelect = (ingredient: Ingredient) => {
    if (ingredients.some((i) => i.id === ingredient.id)) return;
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
    <div className="flex flex-col min-h-screen w-full font-display bg-background text-cream">
      {successId && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-surface border border-green rounded-md shadow-xl animate-fade-in">
          <span className="text-green text-xl">✓</span>
          <div className="flex flex-col">
            <span className="text-cream font-medium">Recipe posted!</span>
            <span className="text-cream/60 text-sm">
              Recipe created successfully.
            </span>
          </div>
          <button
            onClick={() => setSuccessId(null)}
            className="ml-4 text-cream/40 hover:text-cream transition-colors"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-surface border border-red-400/50 rounded-md shadow-xl">
          <span className="text-red-400 text-xl">✕</span>
          <div className="flex flex-col">
            <span className="text-cream font-medium">Something went wrong</span>
            <span className="text-cream/60 text-sm">
              Your recipe could not be posted. Please try again.
            </span>
          </div>
          <button
            onClick={() => setError(false)}
            className="ml-4 text-cream/40 hover:text-cream transition-colors"
          >
            ✕
          </button>
        </div>
      )}
      <NavBarLanding />
      <div className="flex flex-col m-6 items-center">
        <form
          className="flex flex-col w-full md:w-2/3 lg:w-1/2 gap-6 rounded-lg p-8 bg-surface border border-green-muted shadow-xl"
          onSubmit={(e) => submitRecipe(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl tracking-tight">Create Recipe</h1>
            <div className="w-full border-b border-cream/20 mt-2" />
          </div>

          {/* Basic Info */}
          <RecipeName setTitle={setTitle} title={title} />

          {/* Image Upload Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-cream-dim tracking-wide">
              Cover Image
            </h2>
            <div className="flex flex-col gap-4 p-4 bg-surface2 border border-green-muted rounded-md">
              <input
                type="text"
                placeholder="Paste image URL here (e.g. https://example.com/image.jpg)"
                className="w-full bg-background border border-green-muted p-2 rounded text-cream focus:outline-none focus:border-green transition-colors"
                value={imageSrc}
                onChange={(e) => setImageSrc(e.target.value)}
              />
              {imageSrc && (
                <div className="relative h-120 w-full overflow-hidden rounded border border-green-muted bg-background">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="h-full w-full object-cover opacity-80"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute bottom-2 left-2 bg-surface/80 px-2 py-1 text-xs rounded">
                    Preview
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description and Tags */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-cream-dim tracking-wide">
              Description
            </h2>
            <textarea
              placeholder="Enter a brief description of your recipe..."
              className="w-full bg-background border border-green-muted p-2 rounded text-cream focus:outline-none focus:border-green transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-2xl text-cream-dim tracking-wide">Tags</h2>
              <input
                type="text"
                placeholder="Enter tags separated by commas..."
                className="w-full bg-background border border-green-muted p-2 rounded text-cream focus:outline-none focus:border-green transition-colors"
                value={tags}
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((tag) => tag))
                }
              />
            </div>
            {/* Serves */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl text-cream-dim tracking-wide">Serves</h2>
              <input
                type="number"
                min={1}
                className="w-24 bg-background border border-green-muted p-2 rounded text-cream focus:outline-none focus:border-green transition-colors"
                value={serves}
                onChange={(e) => setServes(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-cream-dim tracking-wide">Details</h2>
            <div className="flex gap-8 p-4 bg-surface2 border border-green-muted rounded-md">
              <Difficulty
                setDifficulty={setDifficulty}
                difficulty={difficulty}
              />
              <div className="border-l border-green-muted h-full" />
              <CookingTime
                setCookTimeMins={setCookTimeMins}
                cookTimeMins={cookTimeMins}
              />
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-cream-dim tracking-wide">
              Essential Ingredients
            </h2>
            <div className="p-4 bg-surface2 border border-green-muted rounded-md">
              <Ingredients
                onIngredientSelect={onIngredientSelect}
                updateIngredientAmount={updateIngredientAmount}
                updateIngredientUnit={updateIngredientUnit}
                onIngredientDelete={onIngredientDelete}
                ingredients={ingredients}
              />
            </div>
          </div>

          {/* Instructions Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-cream-dim tracking-wide">
              Instructions
            </h2>
            <div className="p-4 bg-surface2 border border-green-muted rounded-md">
              <Instructions
                updateInstructionText={updateInstructionText}
                setInstructionTimer={setInstructionTimer}
                removeInstruction={removeInstruction}
                addNewInstruction={addNewInstruction}
                instructions={instructions}
              />
            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full border-b border-cream/20" />
            <button
              type="submit"
              className="self-end px-8 py-3 bg-green-muted hover:bg-green-muted/80 text-cream text-lg rounded transition-all duration-200 border border-cream/10 active:scale-95"
            >
              Post Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
