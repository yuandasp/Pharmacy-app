const express = require('express')
const router = express.Router()
const { transactionController } = require('../controllers/index')

router.get('/my-transactions/:idUser', transactionController.fetchTransactionInfo)
router.put ('/status-transactions/:idTransaction',transactionController.setStatus)


module.exports = router;
