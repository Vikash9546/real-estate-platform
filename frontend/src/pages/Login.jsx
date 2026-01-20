import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

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

      // Redirect based on user role
      if (userData.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userData.role === "OWNER") {
        navigate("/owner/my-listings");
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to manage your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !py-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
