import { useState } from "react";
import type { Ingredient } from "../../interface";
import IngredientSearch from "../IngredientSearch";

export default function Ingredients({
  onIngredientSelect,
  updateIngredientAmount,
  updateIngredientUnit,
  onIngredientDelete,
  ingredients,
}: {
  onIngredientSelect: (i: Ingredient) => void;
  updateIngredientAmount: (i: number, a: number) => void;
  updateIngredientUnit: (i: number, u: string) => void;
  onIngredientDelete: (i: number) => void;
  ingredients: Ingredient[];
}) {
  const [amountInputs, setAmountInputs] = useState<Record<number, string>>({});

  const handleAmountChange = (id: number, raw: string) => {
    setAmountInputs((prev) => ({ ...prev, [id]: raw }));
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) updateIngredientAmount(id, parsed);
  };

  const handleAmountBlur = (id: number) => {
    setAmountInputs((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <IngredientSearch onSelectHandler={onIngredientSelect} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {ingredients.map((i) => (
          <div
            key={i.id}
            className="flex bg-surface2 border border-green-muted hover:border-green transition-all duration-200 rounded-lg p-3"
          >
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h1 className="tracking-wider text-lg">{i.name}</h1>
                <button
                  onClick={() => onIngredientDelete(i.id)}
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
                    onChange={(e) => handleAmountChange(i.id, e.target.value)}
                    onBlur={() => handleAmountBlur(i.id)}
                    className="w-16 bg-surface border border-green-muted rounded px-2 py-0.5 text-cream text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {i.supported_units?.length > 1 ? (
                    <select
                      value={i.unit}
                      onChange={(e) =>
                        updateIngredientUnit(i.id, e.target.value)
                      }
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
                    onClick={() => updateIngredientAmount(i.id, i.amount + 1)}
                    className="text-2xl font-bold hover:text-blue-300 cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateIngredientAmount(i.id, i.amount - 1)}
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
    </div>
  );
}
