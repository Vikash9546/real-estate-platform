const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getAllUsers,
  getPendingProperties,
  approveProperty,
  rejectProperty,
} = require("../controllers/admin.controller");

// Admin only
router.get("/users", authMiddleware, roleMiddleware(["ADMIN"]), getAllUsers);

router.get(
  "/properties/pending",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getPendingProperties
);

router.put(
  "/properties/:id/approve",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  approveProperty
);

router.put(
  "/properties/:id/reject",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  rejectProperty
);

module.exports = router;
