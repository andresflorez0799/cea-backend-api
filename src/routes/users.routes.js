const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/users.controller");

const router = Router();

router.post("/change-password", authMiddleware, usersController.changePassword);

module.exports = router;