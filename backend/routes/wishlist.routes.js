const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  addToWishlist,
  getWishlist,
  removeWishlist,
} = require("../controllers/wishlist.controller");

router.post("/:propertyId", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/:propertyId", authMiddleware, removeWishlist);

module.exports = router;
