import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Protected routes */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
