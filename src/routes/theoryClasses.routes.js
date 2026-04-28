const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const theoryClassesController = require("../controllers/theoryClasses.controller");

const router = Router();

router.get("/", authMiddleware, theoryClassesController.getTheoryClasses);
router.post("/", authMiddleware, requireRole("Admin"), theoryClassesController.createTheoryClass);
router.put("/:id", authMiddleware, requireRole("Admin"), theoryClassesController.updateTheoryClass);
router.patch("/:id/disable", authMiddleware, requireRole("Admin"), theoryClassesController.disableTheoryClass);

module.exports = router;
