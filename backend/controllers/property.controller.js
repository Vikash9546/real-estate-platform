const prisma = require("../config/db");


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
      image,
      googleLocation,
    } = req.body;

    const defaultImages = {
      apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      villa: "https://images.unsplash.com/photo-1580587767d02-3f677ee59b1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      studio: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      house: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      luxury: "https://images.unsplash.com/photo-1600585154340-be6191ecdb50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };

    let propertyImages = image || [];
    if (propertyImages.length === 0) {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('apartment') || lowerTitle.includes('flat')) propertyImages = [defaultImages.apartment];
      else if (lowerTitle.includes('villa')) propertyImages = [defaultImages.villa];
      else if (lowerTitle.includes('studio')) propertyImages = [defaultImages.studio];
      else if (lowerTitle.includes('luxury') || lowerTitle.includes('penthouse')) propertyImages = [defaultImages.luxury];
      else propertyImages = [defaultImages.house];
    }

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
        listingType: "RENT", // Strictly "RENT" only
        image: propertyImages,
        googleLocation: googleLocation || "",
        ownerId: req.user.id,
        status: "PENDING",
      },
    });

    res.status(201).json({ message: "Property created", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


    if (furnished === "true" || furnished === "false") {
      filters.furnished = furnished === "true";
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }


    let orderBy = { createdAt: "desc" };


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


exports.updateProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.ownerId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });

    const updated = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        listingType: "RENT"
      },
    });

    res.json({ message: "Property updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.ownerId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });


    await prisma.wishlist.deleteMany({
      where: { propertyId: req.params.id },
    });


    await prisma.inquiry.deleteMany({
      where: { propertyId: req.params.id },
    });


    await prisma.property.delete({ where: { id: req.params.id } });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      include: {
        _count: {
          select: { inquiries: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
