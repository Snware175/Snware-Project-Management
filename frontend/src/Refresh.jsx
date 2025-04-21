import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useUser } from "./Contexts/UserContext";
import axios from "axios";

function Refresh() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useUser();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logout-event") {
        // Clear user context and redirect
        setUser(null);
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(`${apiUrl}/auth/me`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const { name, email, role, department } = res.data.user;
          setUser({ name, email, role, department });

          // redirect only if you're on root or login
          if (location.pathname === "/" || location.pathname === "/login") {
            navigate("/home", { replace: true });
          }
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading, location.pathname, navigate]);

  return null;
}

export default Refresh;
