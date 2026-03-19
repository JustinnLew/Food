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
    <label className="flex flex-col flex-1">
      Difficulty
      <div className="flex">
        {difficulties.map((d) => {
          return (
            <button
              key={d.id}
              type="button"
              className={`flex-1 cursor-pointer border ${difficulty === d.id ? "border-red-500 border" : "border-gray-300"}`}
              onClick={() => setDifficulty(d.id)}
            >
              {d.type}
            </button>
          );
        })}
      </div>
    </label>
  );
}
