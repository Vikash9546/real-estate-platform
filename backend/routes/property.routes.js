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


router.get("/", getAllProperties);


router.get(
  "/owner/my",
  authMiddleware,
  roleMiddleware(["USER", "OWNER", "ADMIN"]),
  getOwnerProperties
);


router.get("/:id", getPropertyById);


router.post(
  "/",
  authMiddleware,
  roleMiddleware(["USER", "OWNER", "ADMIN"]),
  createProperty
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["USER", "OWNER", "ADMIN"]),
  updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["USER", "OWNER", "ADMIN"]),
  deleteProperty
);

module.exports = router;
