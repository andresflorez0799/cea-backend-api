const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

const router = Router();

router.get("/summary", authMiddleware, requireRole("Admin"), adminController.getSummary);

module.exports = router;