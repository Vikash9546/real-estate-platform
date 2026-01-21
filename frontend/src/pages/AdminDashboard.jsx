import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import {
  approveProperty,
  getPendingProperties,
  getAllAdminProperties,
  rejectProperty,
} from "../api/adminApi";
import { deleteProperty } from "../api/propertyApi"; // Import delete
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allRes] = await Promise.all([
        getPendingProperties(),
        getAllAdminProperties(),
      ]);
      setPending(pendingRes.data);
      setAllProperties(allRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property?")) return;
    try {
      await approveProperty(id);
      fetchData();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this property?")) return;
    try {
      await rejectProperty(id);
      fetchData();
    } catch (err) {
      alert("Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this property? This cannot be undone.")) return;
    try {
      await deleteProperty(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  return (
    <RoleRoute roles={["ADMIN"]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage properties and platform settings</p>
          </header>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === "pending" ? "Pending Approvals" : "All Properties"}
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "pending" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "all" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
                >
                  All Properties
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <input
                type="text"
                placeholder="Search by title, city, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading properties...</div>
            ) : (activeTab === "pending" ? pending : allProperties).filter(p =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.id.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>No properties found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {(activeTab === "pending" ? pending : allProperties)
                  .filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((p) => (
                    <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{p.title}</h4>
                        <p className="text-sm text-slate-500">{p.city} • ₹{p.price}</p>
                        <p className="text-xs text-slate-400 mt-1">Status: <span className={`font-semibold ${p.status === 'APPROVED' ? 'text-emerald-500' : p.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'}`}>{p.status}</span> • ID: {p.id}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {activeTab === "pending" ? (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => handleApprove(p.id)}
                              className="!bg-emerald-600 hover:!bg-emerald-700 !shadow-none"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleReject(p.id)}
                              className="!text-red-600 !border-red-200 hover:!bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/property/edit/${p.id}`)}
                              className="!px-3 !py-1.5"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDelete(p.id)}
                              className="!px-3 !py-1.5 !text-red-600 !border-red-200 hover:!bg-red-50"
                            >
                              Delete
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
      </div>
    </RoleRoute>
  );
}
