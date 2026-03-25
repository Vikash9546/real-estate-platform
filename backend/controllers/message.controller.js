const prisma = require("../config/db");

exports.sendMessage = async (req, res) => {
    try {
        const { content, receiverId, inquiryId } = req.body;
        const senderId = req.user.id;

        if (!content || !receiverId) {
            return res.status(400).json({ message: "Content and receiverId are required" });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId,
                inquiryId: inquiryId || null,
            },
            include: {
                sender: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            include: {
                sender: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInquiryChat = async (req, res) => {
    try {
        const { inquiryId } = req.params;

        const messages = await prisma.message.findMany({
            where: { inquiryId },
            include: {
                sender: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChatList = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all messages involving this user
        const allMessages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Group by the other user and pick the latest message
        const chatMap = new Map();

        allMessages.forEach((msg) => {
            const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!chatMap.has(otherUserId)) {
                const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
                chatMap.set(otherUserId, {
                    user: otherUser,
                    lastMessage: msg.content,
                    lastMessageTime: msg.createdAt,
                    lastMessageSenderId: msg.senderId,
                });
            }
        });

        const chatList = Array.from(chatMap.values());

        res.json(chatList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await prisma.message.findUnique({ where: { id } });
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (message.senderId !== userId) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        await prisma.message.delete({ where: { id } });

        // Emit real-time deletion to the receiver
        const { getIO, getOnlineUsers } = require("../src/socket");
        try {
            const io = getIO();
            const onlineUsers = getOnlineUsers();
            if (io) {
                const receiverSocketId = onlineUsers.get(message.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("message_deleted", { messageId: id });
                }
                // Also notify sender (other tabs)
                const senderSocketId = onlineUsers.get(message.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit("message_deleted", { messageId: id });
                }
            }
        } catch (socketErr) {
            console.error("Socket emit error:", socketErr.message);
        }

        res.json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
