import React, { useState } from "react";
import Button from "./Button";
import { createInquiry } from "../api/inquiryApi";
import { useNavigate } from "react-router-dom";

export default function ContactModal({ isOpen, onClose, propertyId, propertyTitle, ownerId }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            setLoading(true);
            const res = await createInquiry(propertyId, { message });
            const inquiryId = res.data?.inquiry?.id;
            setMessage("");
            onClose();
            // Navigate directly to chat with the property owner
            if (ownerId) {
                navigate(`/chat/${ownerId}${inquiryId ? `?inquiryId=${inquiryId}` : ""}`);
            }
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to send inquiry. Please login first.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Contact Owner
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            Inquiry for: <span className="font-semibold text-slate-900 dark:text-white">{propertyTitle}</span>
                        </p>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Your Message
                        </label>
                        <textarea
                            rows="4"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Hi, I'm interested in this property. Is it still available?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                        💬 After sending, you'll be taken to the chat to continue the conversation.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send & Start Chat"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
