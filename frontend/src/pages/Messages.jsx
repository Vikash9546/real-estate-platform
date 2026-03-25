import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getChatList, deleteConversation } from "../api/messageApi";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

export default function Messages() {
    const { user } = useContext(AuthContext);
    const { socket, onlineUsers } = useContext(SocketContext);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchChats = async () => {
        try {
            const res = await getChatList();
            setChats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchChats(); }, []);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (message) => {
            setChats((prev) => {
                const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
                const otherUser = message.senderId === user?.id ? message.receiver : message.sender;
                const filtered = prev.filter((c) => c.user?.id !== otherUserId);
                return [
                    {
                        user: otherUser || { id: otherUserId, name: "User" },
                        lastMessage: message.content,
                        lastMessageTime: message.createdAt,
                    },
                    ...filtered,
                ];
            });
        };
        socket.on("receive_message", handleNewMessage);
        return () => socket.off("receive_message", handleNewMessage);
    }, [socket, user]);

    const handleDeleteConversation = async (e, otherUserId, name) => {
        e.stopPropagation();
        if (!confirm(`Delete entire conversation with ${name}?`)) return;
        try {
            await deleteConversation(otherUserId);
            setChats((prev) => prev.filter((c) => c.user?.id !== otherUserId));
        } catch (err) {
            alert("Failed to delete conversation");
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Messages</h2>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading conversations...</div>
                ) : chats.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                        <div className="text-5xl mb-4">💬</div>
                        <p className="text-slate-500">No conversations yet. Contact a property owner to start chatting.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                        {chats.filter((c) => c.user?.id).map((chat) => {
                            const isOnline = onlineUsers.includes(chat.user.id);
                            return (
                                <div
                                    key={chat.user.id}
                                    className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    {/* Clickable area */}
                                    <button
                                        onClick={() => navigate(`/chat/${chat.user.id}`)}
                                        className="flex items-center gap-4 flex-1 min-w-0 text-left"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                                                {chat.user.name?.[0]?.toUpperCase() || "?"}
                                            </div>
                                            {isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-900 dark:text-white truncate">{chat.user.name}</h4>
                                                <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{formatTime(chat.lastMessageTime)}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate mt-0.5">{chat.lastMessage || "Start a conversation"}</p>
                                        </div>
                                    </button>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => handleDeleteConversation(e, chat.user.id, chat.user.name)}
                                        className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete conversation"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
