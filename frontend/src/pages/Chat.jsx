import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getConversation } from "../api/messageApi";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

// Group messages by date
function groupByDate(messages) {
    const groups = [];
    let lastDate = null;
    messages.forEach((msg) => {
        const date = new Date(msg.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
        });
        if (date !== lastDate) {
            groups.push({ type: "date", date });
            lastDate = date;
        }
        groups.push({ type: "message", ...msg });
    });
    return groups;
}

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
    const inputRef = useRef(null);
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
                    firstMessage.senderId === otherUserId
                        ? firstMessage.sender
                        : firstMessage.receiver
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

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(scrollToBottom, [messages, isTyping]);

    // Listen for real-time messages
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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit("send_message", {
            content: newMessage.trim(),
            receiverId: otherUserId,
            senderId: currentUserId,
            inquiryId: inquiryId,
        });

        socket.emit("stop_typing", { senderId: currentUserId, receiverId: otherUserId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        setNewMessage("");
        inputRef.current?.focus();
    };

    const grouped = groupByDate(messages);

    return (
        <div className="h-screen flex flex-col" style={{ background: "#efeae2" }}>
            {/* ===== WHATSAPP HEADER ===== */}
            <header style={{ background: "#075e54" }} className="flex items-center gap-3 px-4 py-2.5 text-white shadow-md z-10">
                {/* Back arrow */}
                <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: "#25d366" }}>
                        {otherUser?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isOtherOnline ? "bg-green-400 border-[#075e54]" : "bg-gray-400 border-[#075e54]"}`}
                    />
                </div>

                {/* Name + Status */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-base font-semibold truncate">{otherUser?.name || "Chat"}</h1>
                    {isTyping ? (
                        <p className="text-xs text-green-300 italic">typing...</p>
                    ) : (
                        <p className="text-xs text-white/70">
                            {isOtherOnline ? "online" : "offline"}
                        </p>
                    )}
                </div>

                {/* Action icons */}
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" />
                        </svg>
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ===== CHAT WALLPAPER + MESSAGES ===== */}
            <div
                className="flex-1 overflow-y-auto px-3 py-3 sm:px-6"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8c1b8' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: "#efeae2",
                }}
            >
                <div className="max-w-3xl mx-auto space-y-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-white rounded-lg px-4 py-2 shadow-sm text-sm text-gray-500">Loading messages...</div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center pt-20">
                            <div className="bg-[#fcf4cb] rounded-lg px-4 py-3 shadow-sm text-center max-w-sm">
                                <p className="text-xs text-[#54656f]">
                                    Messages are end-to-end secured. Send a message to start the conversation.
                                </p>
                            </div>
                        </div>
                    ) : (
                        grouped.map((item, idx) => {
                            if (item.type === "date") {
                                return (
                                    <div key={`date-${idx}`} className="flex justify-center my-3">
                                        <span className="bg-white/90 text-[#54656f] text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
                                            {item.date}
                                        </span>
                                    </div>
                                );
                            }

                            const isMine = item.senderId !== otherUserId;
                            const time = new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit", minute: "2-digit",
                            });

                            return (
                                <div key={item.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-[2px]`}>
                                    <div
                                        className={`relative max-w-[75%] sm:max-w-[65%] px-[9px] pt-[6px] pb-[8px] rounded-lg shadow-sm ${
                                            isMine
                                                ? "bg-[#d9fdd3] rounded-tr-none"
                                                : "bg-white rounded-tl-none"
                                        }`}
                                    >
                                        {/* Bubble tail */}
                                        <div
                                            className={`absolute top-0 w-3 h-3 ${
                                                isMine ? "-right-[6px]" : "-left-[6px]"
                                            }`}
                                            style={{
                                                backgroundImage: isMine
                                                    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 13'%3E%3Cpath fill='%23d9fdd3' d='M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z'/%3E%3Cpath fill='%23d9fdd3' d='M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z'/%3E%3C/svg%3E")`
                                                    : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 13'%3E%3Cpath fill='%23fff' d='M6.467 3.568L0 12.193V1h5.188c1.77 0 2.338 1.156 1.28 2.568z'/%3E%3Cpath fill='%23fff' d='M6.467 2.568L0 11.193V0h5.188c1.77 0 2.338 1.156 1.28 2.568z'/%3E%3C/svg%3E")`,
                                                backgroundSize: "contain",
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />

                                        {/* Message text */}
                                        <p className="text-[14.2px] leading-[19px] text-[#111b21] whitespace-pre-wrap break-words">
                                            {item.content}
                                        </p>

                                        {/* Time + ticks */}
                                        <div className="flex items-center justify-end gap-1 -mb-1 mt-[2px]">
                                            <span className="text-[11px] text-[#667781] leading-none">{time}</span>
                                            {isMine && (
                                                <svg className="w-[16px] h-[11px] text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor">
                                                    <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.095a.46.46 0 0 0-.327-.14.494.494 0 0 0-.328.14l-.625.626a.452.452 0 0 0 0 .648l2.96 3.083a.543.543 0 0 0 .376.162.474.474 0 0 0 .372-.164l6.97-8.467a.452.452 0 0 0 .007-.648l-.52-.457zm-2.814 7.66l.605-.734a.452.452 0 0 0-.007-.648l-.52-.457a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-.605.734 1.212 1.029zM3.154 7.5L5.78 4.887a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-2.625 3.237.685-.7z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Typing bubble */}
                    {isTyping && (
                        <div className="flex justify-start mb-[2px]">
                            <div className="relative bg-white rounded-lg rounded-tl-none shadow-sm px-4 py-3">
                                <div className="flex gap-[3px] items-center h-4">
                                    <span className="w-[7px] h-[7px] bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                                    <span className="w-[7px] h-[7px] bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "200ms", animationDuration: "0.6s" }} />
                                    <span className="w-[7px] h-[7px] bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: "400ms", animationDuration: "0.6s" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ===== INPUT BAR ===== */}
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-2 py-2 sm:px-4"
                style={{ background: "#f0f2f5" }}
            >
                {/* Emoji button placeholder */}
                <button type="button" className="p-2 text-[#54656f] hover:text-[#075e54] transition-colors rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

                {/* Attachment button placeholder */}
                <button type="button" className="p-2 text-[#54656f] hover:text-[#075e54] transition-colors rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                {/* Text input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message"
                    className="flex-1 bg-white rounded-[8px] px-4 py-[9px] text-[15px] text-[#111b21] placeholder-[#8696a0] outline-none shadow-sm border-none"
                    style={{ caretColor: "#075e54" }}
                />

                {/* Send button */}
                {newMessage.trim() ? (
                    <button
                        type="submit"
                        className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                        style={{ background: "#075e54" }}
                    >
                        <svg className="w-5 h-5 ml-[2px]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ background: "#075e54" }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
}
