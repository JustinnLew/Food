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
  return (
    <div>
      <IngredientSearch onSelectHandler={onIngredientSelect} />
      <div className="flex flex-col">
        {ingredients.map((ing) => {
          return (
            <div key={ing.id} className="flex">
              <h3>{ing.name}</h3>
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={ing.amount || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateIngredientAmount(ing.id, isNaN(val) ? 0 : val);
                }}
                onBlur={() => {
                  if (ing.amount < 1) updateIngredientAmount(ing.id, 1);
                }}
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIngredientUnit(ing.id, e.target.value)}
              >
                {ing.supported_units.map((u) => {
                  return (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  );
                })}
              </select>
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
  );
}
