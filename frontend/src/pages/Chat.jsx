import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getConversation, sendMessage } from "../api/messageApi";
import Button from "../components/Button";

export default function Chat() {
    const { otherUserId } = useParams();
    const [searchParams] = useSearchParams();
    const inquiryId = searchParams.get("inquiryId");
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);

    const currentUserId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage on login

    const fetchMessages = async () => {
        try {
            const res = await getConversation(otherUserId);
            setMessages(res.data);
            if (res.data.length > 0) {
                const firstMessage = res.data[0];
                setOtherUser(firstMessage.senderId === otherUserId ? firstMessage.sender : firstMessage.receiver);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling for new messages
        return () => clearInterval(interval);
    }, [otherUserId]);

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await sendMessage({
                content: newMessage,
                receiverId: otherUserId,
                inquiryId: inquiryId
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col flex-1 overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                {otherUser?.name?.[0] || "?"}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{otherUser?.name || "Chat"}</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className="!py-1 !px-3 !text-sm" onClick={() => navigate(-1)}>Back</Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                        {loading ? (
                            <div className="text-center text-slate-500">Loading conversation...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-400">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === otherUserId ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.senderId === otherUserId
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
                                            : 'bg-primary-600 text-white rounded-tr-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderId === otherUserId ? 'text-slate-400' : 'text-primary-200'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                        />
                        <Button variant="primary" type="submit" className="!rounded-xl !px-6">
                            Send
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
