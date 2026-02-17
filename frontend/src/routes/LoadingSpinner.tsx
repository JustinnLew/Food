export default function LoadingSpinner() {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
    </div>
  );
}
