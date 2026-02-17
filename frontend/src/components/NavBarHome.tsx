import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-green-500/20 p-6 w-full h-16 flex items-center justify-between">
      <p>Fooood :D</p>
      <div className="flex gap-6">
        <Link to="/signup" className="cursor-pointer">
          Sign Up
        </Link>
        <Link to="/login" className="cursor-pointer">
          Login
        </Link>
      </div>
    </nav>
  );
}
