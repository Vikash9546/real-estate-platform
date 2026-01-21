const router = require("express").Router();

const { register, login, getMe, forgotPassword } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", authMiddleware, getMe);

module.exports = router;
