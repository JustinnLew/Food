import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/Singup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
