import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ roles = [], children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  if (!roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
