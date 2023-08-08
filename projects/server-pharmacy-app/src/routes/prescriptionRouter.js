const express = require("express");
const router = express.Router();
const { prescriptionController } = require("../controllers");
const uploadPrescription = require("../middleware/multerPrescription");

router.post(
  "/upload/:iduser",
  uploadPrescription,
  prescriptionController.uploadPrescription
);
router.get('/:presId', prescriptionController.fetchPrescription)
router.post('/convert-prescription/:idProd', prescriptionController.convertUnitPrescription)
router.post('/prepare-prescription', prescriptionController.preparePrescription)
router.post('/prescription-order/:iduser', prescriptionController.prescriptionOrder)
router.put('/reject-prescriptions/:idPrescription',prescriptionController.rejectPrescription)

module.exports = router;
