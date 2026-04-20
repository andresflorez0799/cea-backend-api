const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const theoryClassesController = require("../controllers/theoryClasses.controller");

const router = Router();

router.get("/", authMiddleware, theoryClassesController.getTheoryClasses);

module.exports = router;