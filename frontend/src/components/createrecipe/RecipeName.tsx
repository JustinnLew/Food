export default function RecipeName({
  setTitle,
  title,
}: {
  setTitle: (t: string) => void;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="title" className="text-2xl text-cream-dim">
        Recipe Name
      </label>
      <input
        id="title"
        type="text"
        placeholder="e.g. Spagehtti Carbonara"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-b-2 border-green-muted/30 p-3 text-xl text-cream placeholder:text-cream-dim focus:outline-none focus:border-green transition-all duration-300 bg-transparent rounded-t-md hover:bg-surface2/50"
      />
    </div>
  );
}
