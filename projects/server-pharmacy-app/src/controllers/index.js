const relatedProduct = require("./relatedProduct");
const authController = require("./authController");
const productController = require("./productController");
const qnaController = require("./qnaController");
const usersController = require("./usersController");
const rajaOngkirController = require("./rajaOngkirController");
const addressController = require("./addressController");
const qnaAdminController = require("./admin/qnaAdminController");
const prescriptionController = require("./prescriptionController");
const transactionController = require("./transactionController");
const orderController = require("./orderController");
const categoryController = require("./categoryController");
const paymentController = require("./paymentController");
const promoController = require("./admin/promoController")
const reportController = require("./reportController");

module.exports = {
  relatedProduct,
  authController,
  productController,
  qnaController,
  usersController,
  rajaOngkirController,
  addressController,
  qnaAdminController,
  prescriptionController,
  transactionController,
  orderController,
  categoryController,
  paymentController,
  promoController,
  reportController,
};
