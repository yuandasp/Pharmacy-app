const express = require("express");
const router = express.Router();
const { reportController } = require("../controllers");

router.get("/transactions", reportController.getSalesTransactionReport);
router.get("/alltransaction", reportController.getAllSalesTransaction);
router.get("/usertransaction", reportController.getUserTransactionReport);
router.get("/allusertransaction", reportController.getAllUserTransactionReport);
router.get("/producttransaction", reportController.getProductTransactionReport);
router.get(
  "/allproducttransaction",
  reportController.getAllProductTransactionReport
);

module.exports = router;
