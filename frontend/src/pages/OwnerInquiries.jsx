import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOwnerInquiries, updateInquiryStatus } from "../api/inquiryApi";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function OwnerInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading inquiries...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500">No inquiries found for your properties.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold uppercase py-1 px-2 rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                                                {inquiry.property.title}
                                            </span>
                                            <span className={`text-xs font-bold uppercase py-1 px-2 rounded-md ${inquiry.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    inquiry.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {inquiry.status}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{inquiry.user.name}</h4>
                                        <p className="text-sm text-slate-500 mb-4">{inquiry.user.email}</p>
                                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 italic">
                                            "{inquiry.message}"
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">Received on {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate(`/chat/${inquiry.user.id}?inquiryId=${inquiry.id}`)}
                                            className="!py-2 !px-4"
                                        >
                                            💬 Chat Now
                                        </Button>
                                        <select
                                            value={inquiry.status}
                                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-xl px-3 outline-none"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="APPROVED">Accept</option>
                                            <option value="REJECTED">Reject</option>
                                        </select>
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
