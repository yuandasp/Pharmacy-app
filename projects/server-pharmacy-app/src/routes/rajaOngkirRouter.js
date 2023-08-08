const express = require("express");
const router = express.Router();

const { rajaOngkirController } = require("../controllers/index");

// Router GET province
router.get("/province", rajaOngkirController.province);
router.get("/city/:provId", rajaOngkirController.city);
router.post("/cost", rajaOngkirController.cost);

module.exports = router;
