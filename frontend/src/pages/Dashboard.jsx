import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
                        Welcome to Your Portal
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                        What would you like to do today?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Seek Path */}
                    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] hover:shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 group-hover:rotate-3 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Find a Home</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Browse through our exclusive listings of apartments, houses, and villas to find your next dream home.
                        </p>
                        <Link to="/">
                            <Button variant="primary" className="w-full">
                                Search Properties
                            </Button>
                        </Link>
                    </div>

                    {/* List Path */}
                    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] hover:shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:rotate-3 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">List a Property</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Post your property for rent or sale and manage inquiries from potential tenants directly.
                        </p>
                        <Link to="/owner/add-property">
                            <Button variant="outline" className="w-full">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link to="/owner/my-listings" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">My Listings</span>
                    </Link>
                    <Link to="/owner/inquiries" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">Inquiries</span>
                    </Link>
                    <Link to="/wishlist" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">Wishlist</span>
                    </Link>
                    <Link to="/chat" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">Messages</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
