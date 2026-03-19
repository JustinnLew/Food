export default function CookingTime({
  setCookTimeMins,
  cookTimeMins,
}: {
  setCookTimeMins: (t: number) => void;
  cookTimeMins: number;
}) {
  return (
    <label className="flex flex-col">
      Cooking Time
      <div className="flex">
        <input
          id="cook-time-mins"
          type="number"
          min="1"
          value={cookTimeMins || ""}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setCookTimeMins(isNaN(val) ? 0 : val);
          }}
          onBlur={() => {
            if (cookTimeMins < 1) setCookTimeMins(1);
          }}
        />
        min
      </div>
    </label>
  );
}
