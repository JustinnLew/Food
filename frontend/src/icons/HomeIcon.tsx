export default function HomeIcon({
  fill = "#000000",
  size = 32,
  className = "",
}: {
  fill?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path fill={fill} d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" />
    </svg>
  );
}
