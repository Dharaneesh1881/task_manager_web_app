import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";

import Layout from "./components/Layout.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Settings from "./pages/settings.jsx";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-mischka-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mischka-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { logout, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 flex items-center justify-center bg-mischka-50">
            <Login />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 flex items-center justify-center bg-mischka-50">
            <SignUp />
          </div>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <TaskProvider>
              <Layout user={user} onLogout={logout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pending" element={<Dashboard filter="pending" />} />
                  <Route path="/completed" element={<Dashboard filter="completed" />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </TaskProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
