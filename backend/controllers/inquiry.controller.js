const prisma = require("../config/db");
const { getIO, getOnlineUsers } = require("../src/socket");


exports.createInquiry = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { message } = req.body;

    // Get the property to find the owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, city: true, price: true, ownerId: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        message,
        propertyId,
        userId: req.user.id,
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, city: true, price: true } },
      },
    });

    // Emit real-time notification to the property owner
    try {
      const io = getIO();
      const onlineUsers = getOnlineUsers();
      if (io) {
        const ownerSocketId = onlineUsers.get(property.ownerId);
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("new_inquiry", inquiry);
          console.log(`📩 Real-time inquiry sent to owner ${property.ownerId}`);
        }
      }
    } catch (socketErr) {
      console.error("Socket emit error (non-fatal):", socketErr.message);
    }

    res.status(201).json({ message: "Inquiry sent", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOwnerInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: {
        property: {
          ownerId: req.user.id,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, city: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    const property = await prisma.property.findUnique({
      where: { id: inquiry.propertyId },
    });

    if (property.ownerId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    res.json({ message: "Inquiry updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
