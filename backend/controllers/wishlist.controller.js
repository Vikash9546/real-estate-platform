const prisma = require("../config/db");

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const exists = await prisma.wishlist.findFirst({
      where: { userId: req.user.id, propertyId },
    });

    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: req.user.id,
        propertyId,
      },
    });

    res.status(201).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { property: true },
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Wishlist
exports.removeWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const item = await prisma.wishlist.findFirst({
      where: { userId: req.user.id, propertyId },
    });

    if (!item) return res.status(404).json({ message: "Not found in wishlist" });

    await prisma.wishlist.delete({ where: { id: item.id } });

    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
