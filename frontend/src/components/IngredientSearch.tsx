import { useEffect, useState, type KeyboardEvent } from "react";

export default function IngredientSearch() {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggesstions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  /*
    If needed add a cache
    const [cache, setCache] = useState();
  */

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=${input}`,
      );
      const data = await res.json();

      const results = data[1];
      setSuggesstions(results);
    } catch (error) {
      console.log("Something went wrong ", error);
    }
  };

  const handleSuggestionSelect = (value: string) => {
    setInput(value);
    setShowSuggestions(false);
    setSelected(0);
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
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="ingredient search"
        className="text-sm font-medium text-gray-700"
      >
        Add ingredients:
      </label>
      <div className="relative">

      <input
        type="text"
        placeholder="Ingredient Name"
        value={input}
        className="border border-gray-400 p-2 rounded w-full focus:outline-none"
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        onKeyDown={(e) => handleKeyDown(e)}
        />
      {showSuggestions && suggestions && (
        <ul className="border-gray-400 z-10 absolute w-full bg-white border-x border-b rounded shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((s, index) => (
            <li
              key={index}
              onMouseDown={() => handleSuggestionSelect(s)}
              onMouseEnter={() => setSelected(index)}
              className={`px-3 py-2 ${selected === index ? "bg-blue-500/50" : "bg-white"}`}>{s}</li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}
