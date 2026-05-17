import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const { fetchMe } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser(form);
      const token = res.data?.token;
      
      if (token) {
          localStorage.setItem("token", token);
          await fetchMe();
          navigate("/dashboard");
      } else {
          navigate("/login");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 mt-16">
          <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E6C594]/25 p-10 shadow-sm space-y-8">
            
            {/* Editorial Title */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Portfolio Access</span>
              <h2 className="text-3xl font-serif font-light text-[#1E140F]">Create Account</h2>
              <p className="text-xs text-[#807268] font-light">Join us to discover and organize curated dream spaces</p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#807268]">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E6C594]/30 focus:border-[#1E140F] bg-white px-4 py-3 text-xs text-[#1E140F] placeholder-[#A6978E] outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#807268]">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E6C594]/30 focus:border-[#1E140F] bg-white px-4 py-3 text-xs text-[#1E140F] placeholder-[#A6978E] outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#807268]">
                  Security Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a strong password (6+ chars)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E6C594]/30 focus:border-[#1E140F] bg-white px-4 py-3 text-xs text-[#1E140F] placeholder-[#A6978E] outline-none transition-all duration-300"
                  required
                  minLength={6}
                />
              </div>

              {/* Submit Button with Circular arrow styling */}
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-between gap-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full pl-6 pr-2 py-2.5 font-semibold uppercase tracking-wider text-[10px] transition-all duration-300 w-full shadow-sm mt-8 disabled:opacity-50"
              >
                {loading ? "Registering Curation Account..." : "Create Account"}
                <span className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1E140F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 text-xs font-bold">
                  →
                </span>
              </button>

            </form>

            <p className="text-center text-xs text-[#807268] font-light pt-4 border-t border-[#FAF8F5]/80">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#B39359] hover:text-[#1E140F] transition-colors pl-1">
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
