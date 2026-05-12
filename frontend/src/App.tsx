import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/Singup";
import Landing from "./routes/Landing";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import CreateRecipe from "./routes/CreateRecipe";
import RecipePage from "./routes/RecipePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
