const express = require("express");
const router = express.Router();
const airportController = require("../controller/airport");
const { protect } = require("../middlewares/JWT");



router.get("/",  airportController.getPaginationAirport);
router.get("/:id",  airportController.getAirport);
router.post("/", protect, airportController.insertAirport);
router.put("/:id", protect, airportController.updateAirport);
router.delete("/:id", protect, airportController.deleteAirport);

module.exports = router;
