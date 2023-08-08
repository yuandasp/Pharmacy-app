const express = require("express");
const router = express.Router();
const { orderController } = require("../controllers");

router.post("/setorder/:iduser", orderController.uploadOrder);
router.get("/waiting/:iduser", orderController.getWaitingOrder);
// router.get("/waitingproduct/:idtransaction", orderController.getWaitingProduct);
router.get("/review/:iduser", orderController.getReviewOrder);
router.get("/allreview/:idadmin", orderController.getAllReviewOrder);
router.get("/allwaiting", orderController.getAllWaitingOrder);
router.get("/prescription/:iduser", orderController.getPrescriptionOrder);
router.get(
  "/allprescription/:idadmin",
  orderController.getAllPrescriptionOrder
);
router.get("/onprocess/:iduser", orderController.getOnProcessOrder);
router.get("/allonprocess/:idadmin", orderController.getAllOnProcessOrder);
router.get("/send/:iduser", orderController.getSendOrder);
router.get("/allsend/:idadmin", orderController.getAllSendOrder);
router.get("/finished/:iduser", orderController.getFinishedOrder);
router.get("/allfinished/:idadmin", orderController.getAllFinishedOrder);
router.patch("/accept/:idadmin", orderController.acceptPayment);
router.patch("/confirm/:iduser", orderController.confirmPayment);
router.patch("/complete/:iduser", orderController.completePayment);
router.patch("/reject/:idadmin", orderController.rejectPayment);
router.patch("/submit/:idadmin", orderController.submitPayment);
router.patch("/cancel-order/:idadmin", orderController.adminCancelOrder);
router.patch("/cancelorder/:iduser", orderController.userCancelOrder);

module.exports = router;
