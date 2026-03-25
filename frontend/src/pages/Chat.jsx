import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getConversation, deleteMessage } from "../api/messageApi";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

export default function Chat() {
    const { user } = useContext(AuthContext);
    const { socket, onlineUsers } = useContext(SocketContext);
    const { otherUserId } = useParams();
    const [searchParams] = useSearchParams();
    const inquiryId = searchParams.get("inquiryId");
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const currentUserId = user?.id;
    const isOtherOnline = onlineUsers.includes(otherUserId);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await getConversation(otherUserId);
            setMessages(res.data);
            if (res.data.length > 0) {
                const firstMessage = res.data[0];
                setOtherUser(
                    firstMessage.senderId === otherUserId ? firstMessage.sender : firstMessage.receiver
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [otherUserId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { fetchMessages(); }, [fetchMessages]);
    useEffect(scrollToBottom, [messages, isTyping]);

    // Close menu on click outside
    useEffect(() => {
        const handleClick = () => setMenuOpenId(null);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            const msgSender = String(message.senderId);
            const msgReceiver = String(message.receiverId);
            const me = String(currentUserId);
            const other = String(otherUserId);

            const isRelevant =
                (msgSender === other && msgReceiver === me) ||
                (msgSender === me && msgReceiver === other);
            if (isRelevant) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === message.id)) return prev;
                    return [...prev, message];
                });
                setIsTyping(false);
            }
        };

        const handleMessageDeleted = ({ messageId }) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        };

        const handleUserTyping = ({ senderId }) => {
            if (String(senderId) === String(otherUserId)) setIsTyping(true);
        };
        const handleUserStopTyping = ({ senderId }) => {
            if (String(senderId) === String(otherUserId)) setIsTyping(false);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_deleted", handleMessageDeleted);
        socket.on("user_typing", handleUserTyping);
        socket.on("user_stop_typing", handleUserStopTyping);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_deleted", handleMessageDeleted);
            socket.off("user_typing", handleUserTyping);
            socket.off("user_stop_typing", handleUserStopTyping);
        };
    }, [socket, otherUserId, currentUserId]);

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (socket && currentUserId) {
            socket.emit("typing", { senderId: currentUserId, receiverId: otherUserId });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stop_typing", { senderId: currentUserId, receiverId: otherUserId });
            }, 1500);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;
        socket.emit("send_message", {
            content: newMessage.trim(),
            receiverId: otherUserId,
            senderId: currentUserId,
            inquiryId,
        });
        socket.emit("stop_typing", { senderId: currentUserId, receiverId: otherUserId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setNewMessage("");
    };

    const handleDelete = async (msgId) => {
        try {
            await deleteMessage(msgId);
            setMessages((prev) => prev.filter((m) => m.id !== msgId));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete");
        }
        setMenuOpenId(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden">

                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                    {otherUser?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isOtherOnline ? "bg-green-500" : "bg-slate-400"}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{otherUser?.name || "Chat"}</h3>
                                {isTyping ? (
                                    <p className="text-xs text-primary-500 font-medium animate-pulse">typing...</p>
                                ) : (
                                    <p className={`text-xs ${isOtherOnline ? "text-green-500" : "text-slate-400"}`}>
                                        {isOtherOnline ? "Online" : "Offline"}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button variant="outline" className="!py-1 !px-3 !text-sm" onClick={() => navigate(-1)}>Back</Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 bg-slate-50/30 dark:bg-slate-900/30">
                        {loading ? (
                            <div className="text-center text-slate-500 py-12 align-self-center self-center w-full">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-20 self-center w-full">
                                <p className="text-slate-400">No messages yet. Say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                // Test Mode: If you are chatting with yourself, alternate the bubbles so you can test the UI
                                const isSelfTest = String(currentUserId) === String(otherUserId);
                                
                                // 1. Check if the message was sent by the current user (me)
                                const isMine = isSelfTest 
                                    ? (index % 2 === 0) // Alternate side in testing mode
                                    : String(msg.senderId) === String(currentUserId);
                                
                                // 2. Conditionally align using self-end for "me" and self-start for "other"
                                return (
                                    <div 
                                        key={msg.id} 
                                        className={`group relative max-w-[75%] md:max-w-[60%] flex flex-col ${isMine ? "self-end items-end" : "self-start items-start"}`}
                                    >
                                        {/* Name header for receiver messages (optional clean look) */}
                                        {!isMine && index === 0 && (
                                            <span className="text-xs text-slate-500 ml-2 mb-1">{otherUser?.name || "Other"}</span>
                                        )}

                                        {/* 3. Conditional colors: Blue for sender, Gray for receiver */}
                                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] ${isMine
                                                ? "bg-blue-500 text-white rounded-br-sm" 
                                                : "bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-gray-100 rounded-bl-sm"
                                                }`}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        
                                        <span className="text-[10px] text-slate-400 mt-1 mx-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>

                                            {/* Delete button - only on own messages */}
                                            {isMine && (
                                                <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(menuOpenId === msg.id ? null : msg.id);
                                                        }}
                                                        className="p-1.5 bg-white shadow-sm rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Delete message"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>

                                                    {/* Confirm popup */}
                                                    {menuOpenId === msg.id && (
                                                        <div className="absolute right-0 top-10 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-1 w-28"
                                                            onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => handleDelete(msg.id)}
                                                                className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            })
                        )}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                        />
                        <Button variant="primary" type="submit" className="!rounded-xl !px-6" disabled={!newMessage.trim()}>
                            Send
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
