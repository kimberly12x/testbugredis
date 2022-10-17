const express = require("express");
const router = express.Router();
const airlinesController = require("../controller/airlines");
const { protect } = require("../middlewares/JWT");
const upload = require("../middlewares/Multer");



router.get("/", airlinesController.getPaginationAirlines);
router.get("/:id", airlinesController.getAirlines);
router.post("/", protect, upload.single("logo"), airlinesController.insertAirlines);
router.put("/:id", protect,upload.single("logo"), airlinesController.updateAirlines);
router.delete("/:id", protect, airlinesController.deleteAirlines);

module.exports = router;
