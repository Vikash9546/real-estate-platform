const express = require("express");
const cors = require("cors");

const authRoutes = require("../routes/auth.routes");
const propertyRoutes = require("../routes/property.routes");
const wishlistRoutes = require("../routes/wishlist.routes");
const inquiryRoutes = require("../routes/inquiry.routes");
const adminRoutes = require("../routes/admin.routes");

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Real Estate API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
