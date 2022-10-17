const express = require("express");
const router = express.Router();
const flightController = require("../controller/flight");
const { protect } = require("../middlewares/JWT");

router.get("/", flightController.getPaginationFlight);
router.get("/:id", flightController.getFlight);
router.post("/", protect, flightController.insertFlight);
router.put("/:id", protect, flightController.updateFlight);
router.delete("/:id", protect, flightController.deleteFlight);

module.exports = router;
