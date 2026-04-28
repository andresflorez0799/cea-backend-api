const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const usersController = require("../controllers/users.controller");

const router = Router();

router.post("/change-password", authMiddleware, usersController.changePassword);
router.get("/", authMiddleware, requireRole("Admin"), usersController.listUsers);
router.post("/", authMiddleware, requireRole("Admin"), usersController.createUser);
router.put("/:id", authMiddleware, requireRole("Admin"), usersController.updateUser);
router.patch("/:id/disable", authMiddleware, requireRole("Admin"), usersController.disableUser);

module.exports = router;
