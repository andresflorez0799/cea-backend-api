const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const vehiclesController = require("../controllers/vehicles.controller");

const router = Router();

router.get("/", authMiddleware, requireRole("Admin"), vehiclesController.listVehicles);
router.post("/", authMiddleware, requireRole("Admin"), vehiclesController.createVehicle);
router.put("/:id", authMiddleware, requireRole("Admin"), vehiclesController.updateVehicle);
router.patch("/:id/disable", authMiddleware, requireRole("Admin"), vehiclesController.disableVehicle);

module.exports = router;
