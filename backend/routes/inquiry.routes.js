const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createInquiry,
  getOwnerInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiry.controller");


router.post(
  "/:propertyId",
  authMiddleware,
  createInquiry
);


router.get(
  "/owner/all",
  authMiddleware,
  getOwnerInquiries
);


router.put(
  "/:id/status",
  authMiddleware,
  updateInquiryStatus
);

module.exports = router;
