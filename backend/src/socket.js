const { Server } = require("socket.io");
const prisma = require("../config/db");

// Map of userId -> socketId for tracking online users
const onlineUsers = new Map();

let ioInstance = null;

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // When a user joins, register them with their userId
    socket.on("join", (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`👤 User ${userId} is now online (socket: ${socket.id})`);

      // Broadcast online users list to everyone
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { content, receiverId, senderId, inquiryId } = data;

        if (!content || !receiverId || !senderId) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        // Save message to database
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

        // Send to sender (confirmation)
        socket.emit("receive_message", message);

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        console.log(`💬 Message from ${senderId} to ${receiverId}: "${content.substring(0, 30)}..."`);
      } catch (error) {
        console.error("❌ Error saving message:", error.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { senderId });
      }
    });

    socket.on("stop_typing", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", { senderId });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log(`🔴 User ${socket.userId} disconnected`);
        // Broadcast updated online users
        io.emit("online_users", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io;
}

// Helper to emit events from outside socket handlers (e.g., from controllers)
function getIO() {
  return ioInstance;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { initSocket, getIO, getOnlineUsers };
