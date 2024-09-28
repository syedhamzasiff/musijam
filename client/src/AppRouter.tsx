import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
