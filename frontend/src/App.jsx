import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Layout from "../components/Layout.jsx";
import Login from "../components/Login.jsx";
import SignUp from "../components/SignUp.jsx";

const App = () => {
  const navigate = useNavigate();

  // Load user from localStorage on first render
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Sync user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // LOGIN / SIGNUP HANDLER
  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    };

    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      {/* PROTECTED APP */}
      <Route
        path="/*"
        element={
          <Layout user={currentUser} onLogout={handleLogout} />
        }
      />
    </Routes>
  );
};

export default App;
