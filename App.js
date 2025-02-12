import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import Home from "./Home";
import Dashboard from "./Dashboard"; // This will be for logged-in users
import Navbar from "./Navbar"; // Navigation component
import GenerateLogo from "./GenerateLogo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <Navbar isAuthenticated={isAuthenticated} />
        
        <div className="container mx-auto py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/generate-logo" element={<GenerateLogo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
