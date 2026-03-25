import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getChatList } from "../api/messageApi";
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

    useEffect(() => {
        fetchChats();
    }, []);

    // Listen for new messages to update the chat list in real-time
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Move this conversation to the top with the new message
            setChats((prev) => {
                const otherUserId =
                    message.senderId === user?.id ? message.receiverId : message.senderId;
                const otherUser =
                    message.senderId === user?.id ? message.receiver : message.sender;

                const filtered = prev.filter((c) => c.user.id !== otherUserId);
                return [
                    {
                        user: otherUser || { id: otherUserId, name: "User" },
                        lastMessage: message.content,
                        lastMessageTime: message.createdAt,
                        lastMessageSenderId: message.senderId,
                    },
                    ...filtered,
                ];
            });
        };

        socket.on("receive_message", handleNewMessage);
        return () => socket.off("receive_message", handleNewMessage);
    }, [socket, user]);

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else if (isYesterday) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "#f0f2f5" }}>
            {/* WhatsApp-style header */}
            <header style={{ background: "#075e54" }} className="px-4 py-3 text-white shadow-md z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-wide">Messages</h1>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <Navbar />

            {/* Chat list */}
            <div className="flex-1 max-w-3xl w-full mx-auto bg-white shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "#075e54" }} />
                            <p className="text-sm text-[#8696a0]">Loading conversations...</p>
                        </div>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#dcf8c6" }}>
                            <svg className="w-10 h-10 text-[#075e54]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#111b21] mb-1">No conversations yet</h3>
                        <p className="text-sm text-[#8696a0] max-w-xs">
                            Contact a property owner to start chatting. Your conversations will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#e9edef]">
                        {chats.map((chat) => {
                            const isOnline = onlineUsers.includes(chat.user.id);
                            const isMySentMessage = chat.lastMessageSenderId === user?.id;

                            return (
                                <button
                                    key={chat.user.id}
                                    onClick={() => navigate(`/chat/${chat.user.id}`)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6f6] transition-colors text-left"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                                            style={{ background: "#25d366" }}
                                        >
                                            {chat.user.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    {/* Name + last message */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[16px] font-medium text-[#111b21] truncate">
                                                {chat.user.name}
                                            </h4>
                                            <span className="text-[12px] text-[#667781] flex-shrink-0 ml-2">
                                                {formatTime(chat.lastMessageTime)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            {/* Double tick for sent messages */}
                                            {isMySentMessage && (
                                                <svg className="w-[16px] h-[11px] text-[#53bdeb] flex-shrink-0" viewBox="0 0 16 11" fill="currentColor">
                                                    <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.095a.46.46 0 0 0-.327-.14.494.494 0 0 0-.328.14l-.625.626a.452.452 0 0 0 0 .648l2.96 3.083a.543.543 0 0 0 .376.162.474.474 0 0 0 .372-.164l6.97-8.467a.452.452 0 0 0 .007-.648l-.52-.457zm-2.814 7.66l.605-.734a.452.452 0 0 0-.007-.648l-.52-.457a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-.605.734 1.212 1.029zM3.154 7.5L5.78 4.887a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-2.625 3.237.685-.7z" />
                                                </svg>
                                            )}
                                            <p className="text-[14px] text-[#667781] truncate">
                                                {chat.lastMessage || "Start a conversation"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
