import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { getOwnerProperties } from '../api/propertyApi';
import { getOwnerInquiries } from '../api/inquiryApi';
import { getWishlist } from '../api/wishlistApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({
        listings: 0,
        inquiries: 0,
        wishlist: 0,
        trend: [],
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [listingsRes, inquiriesRes, wishlistRes] = await Promise.all([
                    getOwnerProperties(),
                    getOwnerInquiries(),
                    getWishlist()
                ]);

                // Mock trend data based on inquiries for visualization
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const trend = days.map((day, i) => ({
                    name: day,
                    inquiries: Math.floor(Math.random() * (inquiriesRes.data.length + 2)),
                    views: Math.floor(Math.random() * 50) + 10
                }));

                setStats({
                    listings: listingsRes.data.length,
                    inquiries: inquiriesRes.data.length,
                    wishlist: wishlistRes.data.length,
                    trend,
                    loading: false
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.loading ? "..." : value}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-0">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
                            Welcome to Your Portal
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                            What would you like to do today?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
                        <StatCard title="My Listings" value={stats.listings} icon="🏠" color="bg-blue-100 dark:bg-blue-900/30 text-blue-600" />
                        <StatCard title="Inquiries" value={stats.inquiries} icon="📩" color="bg-amber-100 dark:bg-amber-900/30 text-amber-600" />
                        <StatCard title="Saved" value={stats.wishlist} icon="❤️" color="bg-rose-100 dark:bg-rose-900/30 text-rose-600" />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Paths */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
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

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-lg">⚡</span>
                                Quick Links
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Link to="/owner/my-listings" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white">My Listings</span>
                                </Link>
                                <Link to="/owner/inquiries" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white">Inquiries</span>
                                </Link>
                                <Link to="/wishlist" className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white">Wishlist</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Chart Sidebar */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Activity Trend</h4>
                            <p className="text-sm text-slate-500">Inquiries over last 7 days</p>
                        </div>
                        <div className="flex-1 min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.trend}>
                                    <defs>
                                        <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} py={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="inquiries" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorInq)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Peak Performance</span>
                                <span className="font-bold text-emerald-500">+12% from last week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
