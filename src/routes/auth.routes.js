const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = Router();

router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;