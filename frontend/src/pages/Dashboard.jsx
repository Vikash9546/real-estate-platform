import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer';
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

    const StatCard = ({ title, value, icon, bgClass }) => (
        <div className="bg-white p-6 rounded-[24px] border border-[#E6C594]/25 shadow-sm flex items-center gap-4 transition-transform duration-300 hover:scale-105">
            <div className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center text-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#807268]">{title}</p>
                <p className="text-2xl font-serif font-light text-[#1E140F] mt-0.5">
                    {stats.loading ? "••" : value}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#2A1E17] font-sans antialiased flex flex-col justify-between">
            <div>
                <Navbar />

                <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 mt-16">
                    
                    {/* Welcome Header & Brief stats */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 pb-8 border-b border-[#E6C594]/20">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B39359]">Member Area</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1E140F] mt-1 leading-tight">
                                Client Dashboard
                            </h1>
                            <p className="text-xs text-[#807268] font-light mt-2">
                                Coordinate list parameters, manage property inquiries, and audit bookmarked properties
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                            <StatCard title="My Listings" value={stats.listings} icon="🏠" bgClass="bg-[#FAF8F5] border border-[#E6C594]/20" />
                            <StatCard title="Inquiries" value={stats.inquiries} icon="📩" bgClass="bg-[#FAF8F5] border border-[#E6C594]/20" />
                            <StatCard title="Bookmarks" value={stats.wishlist} icon="❤️" bgClass="bg-[#FAF8F5] border border-[#E6C594]/20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
                        
                        {/* Left action paths */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Seek Path Card */}
                                <div className="group relative bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F6F3ED] text-[#1E140F] flex items-center justify-center mb-6 group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif font-light text-[#1E140F] mb-2">Find a Space</h3>
                                    <p className="text-xs text-[#807268] font-light mb-8 leading-relaxed">
                                        Explore the premium curated collection of apartments, architectural villas, historic estates, and creative lofts.
                                    </p>
                                    
                                    <Link to="/">
                                        <button className="group flex items-center justify-between gap-4 bg-[#1E140F] hover:bg-[#B39359] text-white rounded-full pl-6 pr-2 py-2.5 font-semibold uppercase tracking-wider text-[10px] transition-all duration-300 w-full">
                                            Search Portfolio
                                            <span className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#1E140F] flex items-center justify-center text-xs font-bold transition-transform group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </button>
                                    </Link>
                                </div>

                                {/* List Path Card */}
                                <div className="group relative bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F6F3ED] text-[#1E140F] flex items-center justify-center mb-6 group-hover:bg-[#1E140F] group-hover:text-white transition-colors duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif font-light text-[#1E140F] mb-2">Post an Asset</h3>
                                    <p className="text-xs text-[#807268] font-light mb-8 leading-relaxed">
                                        Publish your architectural residence for lease or sale and streamline direct communication with qualified curators.
                                    </p>
                                    
                                    <Link to="/owner/add-property">
                                        <button className="group flex items-center justify-between gap-4 border border-[#E6C594]/30 hover:border-[#1E140F] text-[#1E140F] rounded-full pl-6 pr-2 py-2.5 font-semibold uppercase tracking-wider text-[10px] transition-all duration-300 w-full hover:bg-[#FAF8F5]">
                                            Get Started
                                            <span className="w-7 h-7 rounded-full bg-[#1E140F] text-white flex items-center justify-center text-xs font-bold transition-transform group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </button>
                                    </Link>
                                </div>

                            </div>

                            {/* Feed Stats Area */}
                            <div className="bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm space-y-6">
                                <h4 className="text-xl font-serif font-light text-[#1E140F] flex items-center gap-2">
                                    <span className="p-2 bg-[#F6F3ED] border border-[#E6C594]/15 rounded-lg text-base">⚡</span>
                                    Administrative Links
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <Link to="/owner/my-listings" className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6C594]/20 text-center hover:border-[#1E140F] transition-all duration-300">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E140F]">My Listings</span>
                                    </Link>
                                    <Link to="/owner/inquiries" className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6C594]/20 text-center hover:border-[#1E140F] transition-all duration-300">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E140F]">Inquiries</span>
                                    </Link>
                                    <Link to="/wishlist" className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6C594]/20 text-center hover:border-[#1E140F] transition-all duration-300">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1E140F]">Saved List</span>
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* Right Area Chart Card */}
                        <div className="lg:col-span-4 bg-white rounded-[28px] p-8 border border-[#E6C594]/25 shadow-sm space-y-6 flex flex-col justify-between">
                            <div className="space-y-1">
                                <h4 className="text-xl font-serif font-light text-[#1E140F]">Activity Trend</h4>
                                <p className="text-[10px] text-[#807268] uppercase font-bold tracking-wider">Inquiries over 7 days</p>
                            </div>

                            <div className="flex-1 min-h-[250px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.trend}>
                                        <defs>
                                            <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#B39359" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#B39359" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5EFE6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#807268' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#807268' }} width={20} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1E140F', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                                        />
                                        <Area type="monotone" dataKey="inquiries" stroke="#B39359" strokeWidth={2} fillOpacity={1} fill="url(#colorInq)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#E6C594]/20 flex items-center justify-between text-xs">
                                <span className="text-[#807268] font-light">Peak Performance</span>
                                <span className="font-semibold text-emerald-600">+12% from last week</span>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
