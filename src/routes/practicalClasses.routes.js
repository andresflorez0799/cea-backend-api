const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const practicalClassesController = require("../controllers/practicalClasses.controller");

const router = Router();

router.get("/", authMiddleware, practicalClassesController.getPracticalClasses);
router.post("/", authMiddleware, practicalClassesController.createPracticalClass);

module.exports = router;