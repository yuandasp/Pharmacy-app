const authRoutes = require("./authRoutes");
const relatedProductRouter = require("./relatedProductRouter");
const productRoutes = require("./productRoutes");
const qnaRoute = require("./qnaRoute");
const usersRoute = require("./usersRoute");
const categoryRoutes = require("./categoryRoutes");
const transactionRoutes = require("./transactionRoutes");
const rajaOngkirRouter = require("./rajaOngkirRouter");
const addressRoute = require("./addressRoute");
const qnaAdminRoutes = require("./admin/qnaAdminRoute");
const prescriptionRouter = require("./prescriptionRouter");
const transactionRoute = require("./transactionRoute");
const orderRouter = require("./orderRouter");
const productOnAdminRoute = require("./admin/productOnAdminRoute");
const paymentRouter = require("./paymentRouter");
const unitConversionOnAdminRoute = require("./admin/unitConversionOnAdmin");
const promoProductRoute = require("./admin/promoProductRoute");
const historyProductRoute = require("./admin/historyProductRoute");
const promoRoute = require("./admin/promoRoute")
const reportRouter = require("./reportRoute");

module.exports = {
  authRoutes,
  relatedProductRouter,
  productRoutes,
  qnaRoute,
  usersRoute,
  categoryRoutes,
  transactionRoutes,
  rajaOngkirRouter,
  prescriptionRouter,
  addressRoute,
  qnaAdminRoutes,
  transactionRoute,
  orderRouter,
  productOnAdminRoute,
  paymentRouter,
  unitConversionOnAdminRoute,
  promoProductRoute,
  historyProductRoute,
  promoRoute,
  reportRouter,
};
