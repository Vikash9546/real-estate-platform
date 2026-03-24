const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

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
  getOwnerProperties
);


router.get("/:id", getPropertyById);


router.post(
  "/",
  authMiddleware,
  createProperty
);

router.put(
  "/:id",
  authMiddleware,
  updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProperty
);

module.exports = router;
