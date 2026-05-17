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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToConsultation = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("consultation-form-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#consultation-form-section");
      setTimeout(() => {
        document.getElementById("consultation-form-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${isActive(to)
        ? "text-[#E6C594] border-b border-[#E6C594]/80"
        : scrolled 
          ? "text-[#2A1E17] hover:text-[#B39359]" 
          : "text-white/80 hover:text-white hover:scale-105"
        }`}
    >
      {children}
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/95 dark:bg-[#1E140F]/95 backdrop-blur-xl border-b border-[#E6C594]/20 shadow-md py-3"
        : "bg-gradient-to-b from-[#120B08]/80 to-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <div className="flex items-baseline leading-none">
              <span className={`text-2xl font-serif font-light tracking-[0.08em] transition-colors duration-500 ${
                scrolled ? "text-[#1E140F]" : "text-white"
              }`}>
                Estate
              </span>
              <span className="text-3xl font-serif italic font-normal text-[#E6C594] ml-0.5 relative -top-[2px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 inline-block">
                X
              </span>
            </div>
            <span className="text-[6.5px] font-sans font-bold tracking-[0.55em] text-[#E6C594] uppercase mt-1.5 leading-none pl-[1px] transition-all duration-300 group-hover:tracking-[0.65em]">
            Premium Real Estate Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/wishlist">Wishlist</NavLink>

            {user && (
              <>
                <NavLink to="/owner/add-property">Add Property</NavLink>
                <NavLink to="/owner/my-listings">My Listings</NavLink>
                <NavLink to="/owner/inquiries">Inquiries</NavLink>
                <NavLink to="/messages">Chat</NavLink>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* User Info / Auth */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  scrolled ? "text-[#2A1E17] hover:text-[#B39359]" : "text-white/80 hover:text-white"
                }`}>
                  Login
                </Link>
                <Link to="/register">
                  <span className="inline-flex items-center justify-center bg-[#E6C594]/15 hover:bg-[#E6C594]/30 border border-[#E6C594]/30 text-[#E6C594] rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300">
                    Register
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className={`hidden sm:flex flex-col items-end leading-tight hover:opacity-80 transition-opacity`}
                >
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    scrolled ? "text-[#2A1E17]" : "text-white"
                  }`}>
                    {user.name}
                  </span>
                  <span className="text-[9px] font-medium text-[#E6C594]">
                    {user.role === "ADMIN" ? "Administrator" : user.role === "OWNER" ? "Owner" : "Client"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-300 ${
                    scrolled 
                      ? "border-[#2A1E17]/20 text-[#2A1E17] hover:bg-[#2A1E17] hover:text-white" 
                      : "border-white/20 text-white hover:bg-white hover:text-[#120B08]"
                  }`}
                >
                  Logout
                </button>
              </div>
            )}

            {/* Premium Get Consultation Pill Button */}
            <button
              onClick={scrollToConsultation}
              className={`hidden md:inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-300 ${
                scrolled
                  ? "bg-[#1E140F] hover:bg-[#E6C594] text-white hover:text-[#1E140F] shadow-md"
                  : "bg-white hover:bg-[#E6C594] text-[#1E140F] hover:shadow-lg hover:shadow-[#E6C594]/20"
              }`}
            >
              Get Consultation
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            
          </div>
        </div>
      </div>
    </header>
  );
}
