const { relatedProduct } = require(`../controllers/index`);
const express = require(`express`);

const router = express.Router();

router.post("/relatedproduct", relatedProduct.getRelatedProduct);

module.exports = router;
