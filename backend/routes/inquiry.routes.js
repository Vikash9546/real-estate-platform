const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createInquiry,
  getOwnerInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiry.controller");

// User creates inquiry
router.post(
  "/:propertyId",
  authMiddleware,
  roleMiddleware(["USER"]),
  createInquiry
);

// Owner sees inquiries
router.get(
  "/owner/all",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  getOwnerInquiries
);

// Owner updates inquiry status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  updateInquiryStatus
);

module.exports = router;
