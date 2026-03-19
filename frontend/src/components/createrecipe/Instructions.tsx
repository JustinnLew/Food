import type { RecipeInstruction } from "../../interface";

export default function Instructions({
  updateInstructionText,
  setInstructionTimer,
  removeInstruction,
  addNewInstruction,
  instructions,
}: {
  updateInstructionText: (i: number, t: string) => void;
  setInstructionTimer: (i: number, t: number) => void;
  removeInstruction: (i: number) => void;
  addNewInstruction: () => void;
  instructions: RecipeInstruction[];
}) {
  return (
    <div className="flex flex-col">
      {instructions.map((inst, index) => {
        return (
          <div key={index} className="flex gap-3">
            <h3>{index + 1}</h3>
            <textarea
              className="flex-1"
              placeholder={"Describe this step..."}
              value={inst.text}
              onChange={(e) => updateInstructionText(index, e.target.value)}
            ></textarea>
            <label className="flex flex-col">
              Timer (min)
              <input
                type="number"
                value={inst.timer || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setInstructionTimer(index, isNaN(val) ? 0 : val);
                }}
                onBlur={() => {
                  if (inst.timer < 1) setInstructionTimer(index, 1);
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
      <button type="button" onClick={addNewInstruction} className="w-full">
        {" "}
        + add step
      </button>
    </div>
  );
}
