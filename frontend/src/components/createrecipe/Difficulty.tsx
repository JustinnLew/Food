export default function Difficulty({
  setDifficulty,
  difficulty,
}: {
  setDifficulty: (d: number) => void;
  difficulty: number;
}) {
  const difficulties = [
    { id: 1, type: "Easy" },
    { id: 2, type: "Medium" },
    { id: 3, type: "Hard" },
  ];

  return (
    <div className="flex flex-col flex-1 gap-2">
      <label className="text-xs uppercase tracking-[0.2em] text-cream-dim font-medium">
        Difficulty
      </label>
      <div className="flex bg-background border border-green-muted/30 rounded overflow-hidden p-1">
        {difficulties.map((d) => {
          const isActive = difficulty === d.id;
          return (
            <button
              key={d.id}
              type="button"
              className={`flex-1 py-2 text-sm transition-all duration-200 cursor-pointer rounded
                ${
                  isActive
                    ? "bg-green-muted text-cream shadow-inner"
                    : "text-cream-dim hover:text-cream hover:bg-surface2"
                }`}
              onClick={() => setDifficulty(d.id)}
            >
              {d.type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
