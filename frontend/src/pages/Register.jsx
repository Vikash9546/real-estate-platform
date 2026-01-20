import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser(form);
      // Optional: Auto login or redirect to login with success message
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join us to find your perfect home</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Account Type
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="USER">User - Browse and rent properties</option>
                <option value="OWNER">Owner - List and manage properties</option>
                <option value="ADMIN">Admin - Full platform management</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                {form.role === "USER" && "Browse properties, save favorites, and contact owners"}
                {form.role === "OWNER" && "List your properties and manage rental inquiries"}
                {form.role === "ADMIN" && "Approve listings and manage the platform"}
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !py-3"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
