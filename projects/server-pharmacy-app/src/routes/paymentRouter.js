const express = require("express");
const router = express.Router();
const { paymentController } = require("../controllers");
const uploadPayment = require("../middleware/multerPayment");

router.post(
  "/upload/:idtransaction",
  uploadPayment,
  paymentController.uploadPayment
);

module.exports = router;
