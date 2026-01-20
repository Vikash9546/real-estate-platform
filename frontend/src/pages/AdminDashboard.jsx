import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RoleRoute from "../components/RoleRoute";
import Button from "../components/Button";
import {
  approveProperty,
  getPendingProperties,
  rejectProperty,
} from "../api/adminApi";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingProperties();
      setPending(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property?")) return;
    try {
      await approveProperty(id);
      fetchPending();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this property?")) return;
    try {
      await rejectProperty(id);
      fetchPending();
    } catch (err) {
      alert("Failed to reject");
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
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pending Approvals</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading pending properties...</div>
            ) : pending.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>No properties pending approval.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {pending.map((p) => (
                  <div key={p.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{p.title}</h4>
                      <p className="text-sm text-slate-500">{p.city} • ₹{p.price}</p>
                      <p className="text-xs text-slate-400 mt-1">ID: {p.id}</p>
                    </div>

                    <div className="flex items-center gap-3">
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
