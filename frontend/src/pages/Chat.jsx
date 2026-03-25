import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getConversation } from "../api/messageApi";
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

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            const isRelevant =
                (message.senderId === otherUserId && message.receiverId === currentUserId) ||
                (message.senderId === currentUserId && message.receiverId === otherUserId);
            if (isRelevant) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === message.id)) return prev;
                    return [...prev, message];
                });
                setIsTyping(false);
            }
        };

        const handleUserTyping = ({ senderId }) => {
            if (senderId === otherUserId) setIsTyping(true);
        };
        const handleUserStopTyping = ({ senderId }) => {
            if (senderId === otherUserId) setIsTyping(false);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleUserTyping);
        socket.on("user_stop_typing", handleUserStopTyping);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
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
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
                        {loading ? (
                            <div className="text-center text-slate-500 py-12">Loading...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-400">No messages yet. Say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMine = msg.senderId !== otherUserId;
                                return (
                                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine
                                            ? "bg-primary-600 text-white rounded-br-sm"
                                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm border border-slate-100 dark:border-slate-700"
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMine ? "text-primary-200" : "text-slate-400"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
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
