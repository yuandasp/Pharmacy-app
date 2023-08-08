const express = require("express");
const router = express.Router();
const { productController } = require("../../controllers");
const { verifyToken } = require("../../middleware/authVerification");
const { isAdmin } = require("../../middleware/isAdmin");

router.get(
  "/product-stock/all",
  verifyToken,
  isAdmin,
  productController.getAllHistoryProductStock
);
router.get(
  "/product-stock/:idproduct",
  verifyToken,
  isAdmin,
  productController.getHistoryProductStockByIdproduct
);

module.exports = router;
