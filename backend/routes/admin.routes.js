const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  getAllUsers,
  getPendingProperties,
  getAllAdminProperties,
  approveProperty,
  rejectProperty,
} = require("../controllers/admin.controller");


router.get("/users", authMiddleware, getAllUsers);

router.get(
  "/properties/pending",
  authMiddleware,
  getPendingProperties
);

router.get(
  "/properties/all",
  authMiddleware,
  getAllAdminProperties
);

router.put(
  "/properties/:id/approve",
  authMiddleware,
  approveProperty
);

router.put(
  "/properties/:id/reject",
  authMiddleware,
  rejectProperty
);

module.exports = router;
