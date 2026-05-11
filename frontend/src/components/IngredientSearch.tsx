import { useEffect, useState, type KeyboardEvent } from "react";
import AuthFetch from "../auth/AuthFetch";
import type { Ingredient } from "../interface";

export default function IngredientSearch({
  onSelectHandler,
}: {
  onSelectHandler: (ingredient: Ingredient) => void;
}) {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  /*
    If needed add a cache
    const [cache, setCache] = useState();
  */

  const fetchSuggestions = async () => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await AuthFetch({
        path: `http://127.0.0.1:3000/api/ingredients?q=${input}`,
        method: "GET",
      });
      const data = await res.json();

      const results = data;
      setSuggestions(results);
      setSelected(0);
    } catch (error) {
      console.log("Something went wrong ", error);
    }
  };

  const handleSuggestionSelect = (value: Ingredient) => {
    setInput(value.name);
    setShowSuggestions(false);
    setSelected(0);
    onSelectHandler(value);
  };

  useEffect(() => {
    const timer = setTimeout(fetchSuggestions, 100);
    return () => clearTimeout(timer);
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelected((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelected((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (selected >= 0 && suggestions[selected]) {
        handleSuggestionSelect(suggestions[selected]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for an ingredient…"
          value={input}
          className="border border-green-muted p-2 rounded w-full focus:outline-none bg-surface text-lg"
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        {showSuggestions && suggestions && (
          <ul className="z-10 absolute w-full rounded max-h-60 overflow-y-auto">
            {suggestions.map((s, index) => (
              <li
                key={s.id}
                onMouseDown={() => handleSuggestionSelect(s)}
                onMouseEnter={() => setSelected(index)}
                className={`px-3 py-2 ${selected === index ? "bg-green-muted" : "bg-surface"}`}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
