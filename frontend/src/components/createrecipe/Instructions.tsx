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
    <div className="flex flex-col gap-5">
      {instructions.map((inst, index) => {
        return (
          <div key={index} className="flex gap-4 items-start group">
            {/* Step Number */}
            <div className="flex flex-col items-center">
              <span className="text-2xl text-cream">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-px h-full bg-green-muted/20 my-2 group-last:hidden" />
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Instruction Textarea */}
                <textarea
                  className="flex-1 bg-background border border-green-muted/50 rounded-md p-3 text-cream placeholder:text-cream/20 focus:outline-none focus:border-green transition-colors min-h-[80px] resize-none"
                  placeholder={"Describe this step..."}
                  value={inst.text}
                  onChange={(e) => updateInstructionText(index, e.target.value)}
                />

                {/* Timer Input */}
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-[10px] uppercase tracking-widest text-cream-dim">
                    Timer (min)
                  </label>
                  <input
                    type="number"
                    className="bg-background border border-green-muted/50 rounded-md p-2 text-cream focus:outline-none focus:border-green transition-colors text-center"
                    value={inst.timer || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setInstructionTimer(index, isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => {
                      if (inst.timer < 1) setInstructionTimer(index, 1);
                    }}
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  className="mt-6 p-2 text-cream-dim hover:text-red-400 transition-colors cursor-pointer self-start"
                  onClick={() => removeInstruction(index)}
                  title="Remove step"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Step Button */}
      <button
        type="button"
        onClick={addNewInstruction}
        className="mt-2 w-full py-3 border border-dashed border-green-muted rounded-md text-cream-dim hover:text-cream hover:border-green-muted hover:bg-green-muted/5 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Step
      </button>
    </div>
  );
}
