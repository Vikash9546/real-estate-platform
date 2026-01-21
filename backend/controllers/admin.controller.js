const prisma = require("../config/db");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET pending properties
const getPendingProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: "PENDING" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    return res.json(properties);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// APPROVE property
const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    return res.json({ message: "Property approved", property: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// REJECT property
const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.property.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return res.json({ message: "Property rejected", property: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all properties (Admin)
const getAllAdminProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    return res.json(properties);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getPendingProperties,
  getAllAdminProperties,
  approveProperty,
  rejectProperty,
};
