const express = require("express");
const router = express.Router();
const {promoController}= require("../../controllers")

router.post('/new-discount', promoController.createDiscount)
router.get('/discounts',promoController.allDiscounts)
router.put('/disable-discount/:idpromo',promoController.disableDiscount)
router.put('/enable-discount/:idpromo',promoController.enableDiscount)
router.put('/update-discount/:idpromo', promoController.updateDiscount)
router.get('/discount/:idpromo', promoController.fetchDiscount)
router.put('/assign-products/:idpromo', promoController.assignPromoProducts)
router.get('/transaction-discounts',promoController.fetchTransactionDiscount)
router.get('/reports/bonus-items',promoController.bonusItemData)
router.get('/reports/transaction-discounts',promoController.transactionDiscountData)
router.get('/reports/product-discounts',promoController.productDiscountData)


module.exports = router;
