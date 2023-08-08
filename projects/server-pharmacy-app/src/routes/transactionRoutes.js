const express = require("express");
const router = express.Router();
const { transactionController } = require("../controllers");

router.get("/", transactionController.getAllOrderList)
router.get("/:idTransaction", transactionController.getOneOrderById)
router.delete("/:idTransaction", transactionController.cancelOrderById)

module.exports = router;