import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";

export default function Login() {
  const { fetchMe } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      const userData = await fetchMe();

      if (userData.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
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
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Welcome Back</span>
              <h2 className="text-3xl font-serif font-light text-[#1E140F]">Account Portal</h2>
              <p className="text-xs text-[#807268] font-light">Sign in to coordinate your luxury portfolios</p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
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
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#807268]">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[10px] font-semibold text-[#B39359] hover:text-[#1E140F] transition-colors">
                    Forgot Key?
                  </Link>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your security password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-[14px] border border-[#E6C594]/30 focus:border-[#1E140F] bg-white px-4 py-3 text-xs text-[#1E140F] placeholder-[#A6978E] outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Login Button with Premium Circle Arrow style */}
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-between gap-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full pl-6 pr-2 py-2.5 font-semibold uppercase tracking-wider text-[10px] transition-all duration-300 w-full shadow-sm mt-8 disabled:opacity-50"
              >
                {loading ? "Authorizing Security..." : "Secure Sign In"}
                <span className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1E140F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 text-xs font-bold">
                  →
                </span>
              </button>

            </form>

            <p className="text-center text-xs text-[#807268] font-light pt-4 border-t border-[#FAF8F5]/80">
              New to EstateX?{" "}
              <Link to="/register" className="font-semibold text-[#B39359] hover:text-[#1E140F] transition-colors pl-1">
                Create Curation Account
              </Link>
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
