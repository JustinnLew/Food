export default function CookingTime({
  setCookTimeMins,
  cookTimeMins,
}: {
  setCookTimeMins: (t: number) => void;
  cookTimeMins: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="cook-time-mins"
        className="text-xs uppercase tracking-[0.2em] text-cream-dim font-medium"
      >
        Cooking Time
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            id="cook-time-mins"
            type="number"
            min="1"
            className="bg-background border border-green-muted/30 p-2 rounded w-24 text-center text-cream focus:outline-none focus:border-green transition-colors"
            value={cookTimeMins || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setCookTimeMins(isNaN(val) ? 0 : val);
            }}
            onBlur={() => {
              if (cookTimeMins < 1) setCookTimeMins(1);
            }}
          />
        </div>
        <span className="text-cream-dim text-sm tracking-widest uppercase">
          min
        </span>
      </div>
    </div>
  );
}
