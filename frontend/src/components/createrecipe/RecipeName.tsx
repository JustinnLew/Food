export default function RecipeName({
  setTitle,
  title,
}: {
  setTitle: (t: string) => void;
  title: string;
}) {
  return (
    <label className="flex flex-col">
      Recipe Name
      <input
        id="title"
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="max-w-1/2"
      />
    </label>
  );
}
