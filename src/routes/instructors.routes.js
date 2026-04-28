const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const instructorsController = require("../controllers/instructors.controller");

const router = Router();

router.get("/", authMiddleware, requireRole("Admin"), instructorsController.listInstructors);
router.post("/", authMiddleware, requireRole("Admin"), instructorsController.createInstructor);
router.put("/:id", authMiddleware, requireRole("Admin"), instructorsController.updateInstructor);
router.patch("/:id/disable", authMiddleware, requireRole("Admin"), instructorsController.disableInstructor);

module.exports = router;
