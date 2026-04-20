const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const schedulingController = require("../controllers/scheduling.controller");

const router = Router();

router.get("/resources", authMiddleware, schedulingController.getResources);

module.exports = router;