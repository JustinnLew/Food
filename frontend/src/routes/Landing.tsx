import { useSession } from "../auth/SessionContext";
import NavBarLanding from "../components/NavBarLanding";

export default function Landing() {
  const { session } = useSession();

const handleClick = async () => {
  const response = await fetch("http://127.0.0.1:3000/api/protected",
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session?.access_token}`
      }
    }
  );
  const data = await response.text();
  console.log(data);
  console.log(session?.access_token);
}
  return (
    <div className="flex flex-col">
      <NavBarLanding />
      <button onClick={handleClick} className="border border-red-500">
        TEST API
      </button>
    </div>
  );
}
