const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
    sendMessage,
    getConversation,
    getInquiryChat,
    getChatList,
} = require("../controllers/message.controller");

router.post("/", authMiddleware, sendMessage);
router.get("/list", authMiddleware, getChatList);
router.get("/conversation/:otherUserId", authMiddleware, getConversation);
router.get("/inquiry/:inquiryId", authMiddleware, getInquiryChat);

module.exports = router;
