const prisma = require("../config/db");

// Create Property (OWNER)
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      city,
      address,
      area,
      bedrooms,
      bathrooms,
      furnished,
      type,
      listingType,
      images,
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: Number(price),
        city,
        address,
        area: Number(area),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        furnished: furnished || false,
        type: type || "APARTMENT",
        listingType: listingType || "RENT",
        image: images || [],
        ownerId: req.user.id,
        status: "PENDING",
      },
    });

    res.status(201).json({ message: "Property created", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties (Public + Filters)
exports.getAllProperties = async (req, res) => {
  try {
    const {
      city,
      listingType,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      furnished,
      sort,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    console.log("🔍 Search Params:", req.query);



    const filters = { status: "APPROVED" };

    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (city) filters.city = { contains: city, mode: 'insensitive' };
    if (listingType) filters.listingType = listingType;
    if (type) filters.type = type;
    if (bedrooms) filters.bedrooms = Number(bedrooms);

    // Only filter furnished if it's explicitly 'true' or 'false'. Ignore if it's '' (Any)
    if (furnished === "true" || furnished === "false") {
      filters.furnished = furnished === "true";
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }

    // Default: newest first
    let orderBy = { createdAt: "desc" };

    // Handle sort parameter explicitly
    if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "priceAsc") {
      orderBy = { price: "asc" };
    } else if (sort === "priceDesc") {
      orderBy = { price: "desc" };
    }

    console.log("🛠 Constructed Filters:", JSON.stringify(filters, null, 2));

    const properties = await prisma.property.findMany({
      where: filters,
      orderBy,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    console.log(`✅ Found ${properties.length} properties`);

    const total = await prisma.property.count({ where: filters });

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Property By ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Property (Owner only)
exports.updateProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.ownerId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ message: "Property updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Property (Owner only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.ownerId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // First, delete all wishlist entries for this property
    await prisma.wishlist.deleteMany({
      where: { propertyId: req.params.id },
    });

    // Delete all inquiries for this property
    await prisma.inquiry.deleteMany({
      where: { propertyId: req.params.id },
    });

    // Finally, delete the property itself
    await prisma.property.delete({ where: { id: req.params.id } });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Owner Properties
exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
