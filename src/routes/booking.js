const express = require("express");
const router = express.Router();
const bookingController = require("../controller/booking");
const { protect } = require("../middlewares/JWT");

router.get("/",  protect, bookingController.getPaginationBooking);
router.get("/:id", protect,  bookingController.getBooking);
router.post("/", protect, bookingController.insertBooking);
router.put("/:id", protect, bookingController.updateBookingAdmin);

router.delete("/:id", protect, bookingController.deleteBooking);

router.post("/py-verify", bookingController.updateBookingPaymentVerification);
// router.put("/py-error", protect, bookingController.updateBookingAdmin);

router.put("/py-failed", bookingController.failedBookingPayment);

module.exports = router;
