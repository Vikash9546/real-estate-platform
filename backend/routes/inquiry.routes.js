const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createInquiry,
  getOwnerInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiry.controller");


router.post(
  "/:propertyId",
  authMiddleware,
  roleMiddleware(["USER"]),
  createInquiry
);


router.get(
  "/owner/all",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  getOwnerInquiries
);


router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["OWNER", "ADMIN"]),
  updateInquiryStatus
);

module.exports = router;
