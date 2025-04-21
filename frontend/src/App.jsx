import React, { useState, useEffect } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Refresh from "./Refresh";
import GlobalLayout from "./Components/Global/GlobalLayout";
import Admin from "./Pages/Admin";
import { UserProvider, useUser } from "./Contexts/UserContext";
import Profile from "./Components/Global/Profile";

function AppRoutes() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  const PrivateRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  const RoleBasedRoute = ({ allowedRoles, element }) => {
    return user && allowedRoles.includes(user.role) ? (
      element
    ) : (
      <Navigate to="/home" />
    );
  };

  return (
    <GlobalLayout>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <RoleBasedRoute
                allowedRoles={["Super Admin", "Admin", "Manager"]}
                element={<Admin />}
              />
            }
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </div>
    </GlobalLayout>
  );
}

// Wrap entire app with UserProvider
function App() {
  return (
    <UserProvider>
      <Refresh />
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
