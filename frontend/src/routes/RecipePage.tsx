import { useLocation } from "react-router-dom";
import { DIFFICULTY, type Recipe, type RecipeInstruction } from "../interface";
import { useEffect, useRef, useState } from "react";
import NavBarLanding from "../components/NavBarLanding";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function StepTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = () => {
    if (done) {
      setRemaining(seconds);
      setDone(false);
      setRunning(false);
      return;
    }
    if (running) {
      clearInterval(interval.current!);
      setRunning(false);
    } else {
      setRunning(true);
      interval.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval.current!);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => () => clearInterval(interval.current!), []);

  return (
    <button
      onClick={toggle}
      className={`mt-2 inline-flex items-center gap-1.5 text-md px-3 py-1 rounded-full border transition-colors cursor-pointer
        ${
          done
            ? "border-green bg-green/10 text-green"
            : running
              ? "border-green bg-green/10 text-green"
              : "border-green-muted text-cream-dim hover:bg-surface2"
        }`}
    >
      {done
        ? "✓ Done"
        : running
          ? `⏸ ${fmt(remaining)}`
          : `▷ ${fmt(remaining)}`}
    </button>
  );
}

function StepItem({ step, index }: { step: RecipeInstruction; index: number }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex gap-3 items-start">
      <button
        onClick={() => setDone((p) => !p)}
        className={`w-7 h-7 rounded-full border flex items-center justify-center text-md font-medium shrink-0 mt-0.5 cursor-pointer transition-colors
          ${done ? "bg-green/10 border-green text-green" : "bg-surface2 border-green-muted text-cream-dim"}`}
      >
        {done ? "✓" : index + 1}
      </button>
      <div className="flex-1">
        <p
          className={`text-md leading-relaxed transition-colors ${done ? "text-cream-dim line-through" : "text-cream"}`}
        >
          {step.text}
        </p>
        {step.timer > 0 && <StepTimer seconds={step.timer} />}
      </div>
    </div>
  );
}

export default function RecipePage() {
  const { state } = useLocation();
  //   const { id } = useParams();
  const [recipe, _] = useState<Recipe | undefined>(state?.recipe);

  useEffect(() => {
    // if (!recipe) {
    //   // fetch by id fallback
    // }
  }, []);

  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-background font-display text-cream">
        <NavBarLanding />
        <div className="flex items-center justify-center flex-1 text-cream-dim">
          Recipe not found
        </div>
      </div>
    );
  }

  const totalIngredients =
    (recipe.ingredients?.length ?? 0) +
    (recipe.missing_ingredients?.length ?? 0) +
    (recipe.insufficient_ingredients?.length ?? 0);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background font-display text-cream">
      <NavBarLanding />

      {/* Hero */}
      <div className="relative h-56 bg-surface flex items-end">
        {recipe.image_src ? (
          <img
            src={recipe.image_src}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-5xl font-medium text-cream/10 text-center px-6">
              {recipe.title}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <div className="relative z-10 p-5">
          <h1 className="text-4xl font-medium text-white">{recipe.title}</h1>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-2 flex-wrap px-5 py-3 bg-surface border-b border-green-muted items-center">
        <span className="inline-flex items-center gap-1 text-md px-3 py-1 rounded-full border border-green-muted text-cream-dim">
          {recipe.cook_time_mins} min
        </span>
        <span className="inline-flex items-center gap-1 text-md px-3 py-1 rounded-full border border-green-muted text-cream-dim">
          {DIFFICULTY[recipe.difficulty] ?? "Unknown"}
        </span>
        <span className="text-md px-3 py-1 rounded-full font-medium bg-green/10 text-green border border-green">
          {Math.round(recipe.match_score * 100)}% match
        </span>
        {recipe.missing_ingredients &&
          recipe.missing_ingredients.length > 0 && (
            <span className="text-md px-3 py-1 rounded-full bg-red-900/20 text-red-400 border border-red-900">
              {recipe.missing_ingredients.length} missing
            </span>
          )}
        {recipe.insufficient_ingredients &&
          recipe.insufficient_ingredients.length > 0 && (
            <span className="text-md px-3 py-1 rounded-full bg-amber-900/20 text-amber-400 border border-amber-900">
              {recipe.insufficient_ingredients.length} insufficient
            </span>
          )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 m-5 gap-5">
        {/* Ingredients */}
        <div className="lg:w-56 flex flex-col gap-2 shrink-0">
          <p className="text-md font-medium tracking-widest text-cream-dim uppercase">
            Ingredients · {recipe.ingredients?.length ?? 0} of{" "}
            {totalIngredients}
          </p>
          {recipe.ingredients?.map((ing) => (
            <div
              key={ing.name}
              className="bg-surface border border-green-muted rounded-lg px-3 py-2"
            >
              <p className="text-sm font-medium">{ing.name}</p>
              <p className="text-md text-cream-dim mt-0.5">
                {ing.amount} {ing.unit}
              </p>
            </div>
          ))}
          {recipe.insufficient_ingredients?.map((ing) => (
            <div
              key={ing.ingredient}
              className="bg-amber-900/10 border border-amber-900/40 rounded-lg px-3 py-2"
            >
              <p className="text-sm font-medium text-amber-400">
                {ing.ingredient}
              </p>
              <p className="text-md text-amber-600 mt-0.5">
                have {ing.user_amount} {ing.unit} / need {ing.required_amount}{" "}
                {ing.unit}
              </p>
            </div>
          ))}
          {recipe.missing_ingredients?.map((ing) => (
            <div
              key={ing.ingredient}
              className="bg-red-900/10 border border-red-900/40 rounded-lg px-3 py-2"
            >
              <p className="text-sm font-medium text-red-400">
                {ing.ingredient}
              </p>
              <p className="text-md text-red-700 mt-0.5">
                {ing.required_amount} {ing.unit} · missing
              </p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="flex-1 bg-surface border border-green-muted rounded-lg p-5 flex flex-col gap-5">
          <p className="text-md font-medium tracking-widest text-cream-dim uppercase">
            Steps
          </p>
          {recipe.instructions.map((step, i) => (
            <StepItem key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
