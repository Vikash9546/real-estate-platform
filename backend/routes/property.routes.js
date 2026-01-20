const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
} = require("../controllers/property.controller");

// Public
router.get("/", getAllProperties);

// Owner (keep this BEFORE /:id)
router.get(
  "/owner/my",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  getOwnerProperties
);

// Public
router.get("/:id", getPropertyById);

// Owner CRUD
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  createProperty
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  deleteProperty
);

module.exports = router;
