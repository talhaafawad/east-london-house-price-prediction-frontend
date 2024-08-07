import React from "react";
import { auth } from "../services/authService";
import Login from "../pages/login/Login";
import Navbar from "../components/navbar/Navbar";
import Register from "../pages/register/Register";

export function PrivateRoutes({ children }) {
  if (hasPermission()) return <>{children}</>;

  if (window.location.pathname === "/register") return <Register />;
  else return <Login />;
}

function hasPermission() {
  return auth.getCurrentUserDetails();
}
