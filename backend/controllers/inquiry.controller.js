const prisma = require("../config/db");

// Create Inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { message } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        message,
        propertyId,
        userId: req.user.id,
        status: "PENDING",
      },
    });

    res.status(201).json({ message: "Inquiry sent", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner get inquiries
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

// Update Inquiry Status
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
