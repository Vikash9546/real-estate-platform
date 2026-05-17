import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import { getAllUsers, getPendingProperties, getAllAdminProperties, approveProperty, rejectProperty } from "../api/adminApi";
import { deleteProperty } from "../api/propertyApi";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allRes, usersRes] = await Promise.all([
        getPendingProperties(),
        getAllAdminProperties(),
        getAllUsers(),
      ]);
      setPending(pendingRes.data);
      setAllProperties(allRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      fetchData();
    } catch (err) {
      alert("Failed to approve property");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProperty(id);
      fetchData();
    } catch (err) {
      alert("Failed to reject property");
    }
  };

  const handleDeleteClick = (p) => {
    setPropertyToDelete(p);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await deleteProperty(propertyToDelete.id);
      fetchData();
    } catch (err) {
      alert("Failed to delete property");
    } finally {
      setPropertyToDelete(null);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalProperties: allProperties.length,
    pendingApprovals: pending.length,
    totalCities: [...new Set(allProperties.map(p => p.city))].length
  };

  const typeData = Object.entries(
    allProperties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const cityData = Object.entries(
    allProperties.reduce((acc, p) => {
      acc[p.city] = (acc[p.city] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).slice(0, 5);

  const COLORS = ['#000000', '#10b981', '#f59e0b', '#ef4444'];

  const AdminStatCard = ({ title, value, icon, sub }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">{sub}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
  );

  return (
    <RoleRoute roles={["ADMIN"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Platform-wide overview and management</p>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <AdminStatCard title="Total Users" value={stats.totalUsers} icon="👥" sub="+5 this week" />
            <AdminStatCard title="Total Properties" value={stats.totalProperties} icon="🏢" sub="+12 total" />
            <AdminStatCard title="Pending" value={stats.pendingApprovals} icon="⏳" sub="Requires Action" />
            <AdminStatCard title="Unique Cities" value={stats.totalCities} icon="📍" sub="Active Regions" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Charts */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Property Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Top Cities by Listings</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab === "pending" ? "Awaiting Verification" : "Inventory Management"}
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "pending" ? "bg-white dark:bg-slate-700 shadow-lg text-primary-600 dark:text-white" : "text-slate-500"}`}
                >
                  Pending ({pending.length})
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "all" ? "bg-white dark:bg-slate-700 shadow-lg text-primary-600 dark:text-white" : "text-slate-500"}`}
                >
                  All Properties
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-20 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium tracking-wide">Assembling dashboard data...</p>
              </div>
            ) : (activeTab === "pending" ? pending : allProperties).filter(p =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.id.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="p-20 text-center text-slate-500">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-lg font-medium">No results found for "{searchQuery}"</p>
                <p className="mt-1">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(activeTab === "pending" ? pending : allProperties)
                  .filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((p) => (
                    <div key={p.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl overflow-hidden shadow-inner">
                          {p.image?.[0] ? <img src={p.image[0]} className="w-full h-full object-cover" /> : '🏢'}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-xl group-hover:text-primary-600 transition-colors uppercase tracking-tight">{p.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-bold text-primary-500">{p.city}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">₹{p.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : p.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              {p.status}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tighter">ID: {p.id.slice(-8)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {activeTab === "pending" ? (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handleApprove(p.id)}
                              className="!px-8 !py-3 !rounded-xl !bg-emerald-600 hover:!bg-emerald-700 shadow-lg shadow-emerald-500/20 font-black tracking-widest text-xs"
                            >
                              APPROVE
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleReject(p.id)}
                              className="!px-8 !py-3 !rounded-xl !text-rose-600 !border-rose-200 hover:!bg-rose-50 font-black tracking-widest text-xs"
                            >
                              REJECT
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/property/edit/${p.id}`)}
                              className="!px-6 !py-2.5 !rounded-xl !border-slate-200 dark:!border-slate-700 !text-slate-600 dark:!text-slate-300 font-bold text-xs"
                            >
                              EDIT
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteClick(p)}
                              className="!px-6 !py-2.5 !rounded-xl !text-rose-600 !border-rose-200 hover:!bg-rose-50 font-bold text-xs"
                            >
                              DELETE
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Confirmation Modal */}
        {propertyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-6 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Property</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{propertyToDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPropertyToDelete(null)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleRoute>
  );
}
