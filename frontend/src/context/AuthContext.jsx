import React, { createContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await getMe();
      setUser(res.data); // must include role
      return res.data; // Return user data for immediate use
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // redirect will be handled in Navbar using useNavigate
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
