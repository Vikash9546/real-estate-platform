import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive(to)
        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
    >
      {children}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
              R
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
              RealEstate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/wishlist">Wishlist</NavLink>

            {(user?.role === "OWNER" || user?.role === "ADMIN") && (
              <NavLink to="/owner/add-property">Add Property</NavLink>
            )}

            {user?.role === "OWNER" && (
              <NavLink to="/owner/my-listings">My Listings</NavLink>
            )}

            {user?.role === "ADMIN" && (
              <NavLink to="/admin/dashboard">Admin</NavLink>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary-600 dark:text-primary-400">
                    {user.role}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="!px-3 !py-1.5 text-xs"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
