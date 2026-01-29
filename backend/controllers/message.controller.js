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

        // Get unique users that the current user has chatted with
        const sentMessages = await prisma.message.findMany({
            where: { senderId: userId },
            select: { receiverId: true, receiver: { select: { id: true, name: true, email: true } } },
        });

        const receivedMessages = await prisma.message.findMany({
            where: { receiverId: userId },
            select: { senderId: true, sender: { select: { id: true, name: true, email: true } } },
        });

        const chatUsersMap = new Map();

        sentMessages.forEach(m => chatUsersMap.set(m.receiverId, m.receiver));
        receivedMessages.forEach(m => chatUsersMap.set(m.senderId, m.sender));

        const chatList = Array.from(chatUsersMap.values());

        res.json(chatList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
