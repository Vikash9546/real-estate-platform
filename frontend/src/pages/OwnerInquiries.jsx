import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getOwnerInquiries, updateInquiryStatus } from "../api/inquiryApi";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

export default function OwnerInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newInquiryAlert, setNewInquiryAlert] = useState(null);
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    const fetchInquiries = async () => {
        try {
            const res = await getOwnerInquiries();
            setInquiries(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    // Listen for real-time new inquiries
    useEffect(() => {
        if (!socket) return;

        const handleNewInquiry = (inquiry) => {
            // Add the new inquiry to the top of the list
            setInquiries((prev) => {
                // Prevent duplicates
                if (prev.some((i) => i.id === inquiry.id)) return prev;
                return [inquiry, ...prev];
            });

            // Show alert animation
            setNewInquiryAlert(inquiry);
            setTimeout(() => setNewInquiryAlert(null), 5000);
        };

        socket.on("new_inquiry", handleNewInquiry);

        return () => {
            socket.off("new_inquiry", handleNewInquiry);
        };
    }, [socket]);

    const handleStatusChange = async (id, status) => {
        try {
            await updateInquiryStatus(id, { status });
            fetchInquiries();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Property Inquiries</h2>

                    {/* Real-time new inquiry alert */}
                    {newInquiryAlert && (
                        <div className="mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 flex items-center gap-3 animate-pulse">
                            <span className="text-2xl">🔔</span>
                            <div>
                                <p className="font-bold text-primary-700 dark:text-primary-300">
                                    New Inquiry from {newInquiryAlert.user?.name}!
                                </p>
                                <p className="text-sm text-primary-600 dark:text-primary-400">
                                    For: {newInquiryAlert.property?.title} — "{newInquiryAlert.message?.substring(0, 60)}..."
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                className="!py-1.5 !px-4 ml-auto"
                                onClick={() => {
                                    navigate(`/chat/${newInquiryAlert.user?.id}?inquiryId=${newInquiryAlert.id}`);
                                    setNewInquiryAlert(null);
                                }}
                            >
                                💬 Reply Now
                            </Button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading inquiries...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="text-slate-500">No inquiries yet. When someone contacts you about a property, it will appear here in real-time.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold uppercase py-1 px-2 rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                                                {inquiry.property?.title}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{inquiry.user?.name}</h4>
                                        <p className="text-sm text-slate-500 mb-4">{inquiry.user?.email}</p>
                                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 italic">
                                            "{inquiry.message}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate(`/chat/${inquiry.user?.id}?inquiryId=${inquiry.id}`)}
                                            className="!py-2 !px-4"
                                        >
                                            💬 Chat Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
