require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const {
  authRoutes,
  productRoutes,
  qnaRoute,
  usersRoute,
  addressRoute,
  qnaAdminRoutes,
  prescriptionRouter,
  transactionRoute,
  orderRouter,
  productOnAdminRoute,
  categoryRoutes,
  transactionRoutes,
  paymentRouter,
  unitConversionOnAdminRoute,
  promoProductRoute,
  historyProductRoute,
  promoRoute,
  reportRouter,
} = require("./routes");
const { relatedProductRouter } = require("./routes/index");

const { db, query } = require("./database/index");
const PORT = process.env.PORT || 3000;
const app = express();

// API RajaOngkir
const { rajaOngkirRouter } = require("./routes/index");
const { UnitConversionRules } = require("./controllers/productController");

app.use(cors());
app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(","),
    ],
  })
);

app.use(express.json());
app.use(express.static(join(__dirname, "public")));

app.use("/api/uploads", express.static(process.cwd() + "/src/uploads"));

//#region API ROUTES
app.use("/api/rajaongkir", rajaOngkirRouter);

// ===========================
// NOTE : Add your routes here
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/qna", qnaAdminRoutes);
app.use("/api/order", orderRouter);
app.use("/api/admin/products", productOnAdminRoute);
app.use("/api/admin/unit-conversion", unitConversionOnAdminRoute);
app.use("/api/admin/promo", promoProductRoute);
app.use("/api/admin/history", historyProductRoute);

app.use("/api/report", reportRouter);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use(`/api/product`, relatedProductRouter);
app.use(`/api/prescription`, prescriptionRouter);
app.use(`/api/payment`, paymentRouter);
app.use("/api/qna", qnaRoute);
app.use("/api/users", usersRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/promos", promoRoute);

// app.get("/api/greetings", (req, res, next) => {
//   res.status(200).json({
//     message: "Hello, Student !",
//   });
// });

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  console.log(`APP RUNNING at ${PORT} ✅`);
});
