const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

const router = Router();

router.get("/", authMiddleware, dashboardController.getDashboard);

module.exports = router;