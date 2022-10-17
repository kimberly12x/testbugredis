const express = require("express");
const router = express.Router();
const reviewController = require("../controller/review");
const { protect } = require("../middlewares/JWT");

router.get("/",  reviewController.getPaginationReview);
router.get("/:id",  reviewController.getReview);
router.post("/", protect, reviewController.insertReview);
router.put("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
