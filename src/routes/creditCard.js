const express = require("express");
const router = express.Router();
const creditCardController = require("../controller/creditCard");
const { protect } = require("../middlewares/JWT");

router.get("/", protect, creditCardController.getPaginationCreditCard);
router.get("/:id", protect, creditCardController.getCreditCard);
router.post("/", protect, creditCardController.insertCreditCard);
router.put("/:id", protect, creditCardController.updateCreditCard);
router.delete("/:id", protect, creditCardController.deleteCreditCard);

module.exports = router;
