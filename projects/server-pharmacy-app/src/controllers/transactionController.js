const { query, db } = require("../database");

module.exports = {
    getAllOrderList: async (req, res) => {
        try {
            const getAllQuery = `SELECT * FROM product 
            INNER JOIN product_transaction ON product.idproduct = product_transaction.idproduct
            INNER JOIN transaction ON product_transaction.idtransaction = transaction.idtransaction;`;

            const transactions = await query(getAllQuery);

            res.status(200).send({ transactions })
        } catch (error) {
            res.status(500).send({ message: error })
        }

    },
    getOneOrderById: async (req, res) => {
        const { idTransaction } = req.params;

        try {
            const getOneTransactionByIdQuery = `
            SELECT
                transaction.*,
                product.idproduct as 'product.idproduct',
                product.name as 'product.name',
                product.price as 'product.price',
                product.description as 'product.description',
                product.product_image as 'product.product_image',
                product_transaction.quantity as 'product.quantity',
                (product_transaction.quantity * product.price) as 'product.totalProductPrice'
            FROM transaction 
            INNER JOIN
                product_transaction ON transaction.idtransaction = product_transaction.idtransaction
            INNER JOIN
                product ON product_transaction.idproduct = product.idproduct
            WHERE transaction.idtransaction = ${idTransaction};`;

            const result = await query(getOneTransactionByIdQuery);

            if (!result[0]) {
                return res.status(404).send({ message: 'Transaction not found' });
            }

            const transaction = {}
            const product = []

            result.forEach(trx => {
                const objProduct = {}
                Object.keys(trx).forEach(key => {
                    if (!transaction[key] && !key.match(/\bproduct.\b/)) {
                        transaction[key] = trx[key]
                    }
                    if (key.match(/\bproduct.\b/)) {
                        objProduct[key.split('product.')[1]] = trx[key]
                        delete trx[key]
                    }
                })
                product.push(objProduct)
            })

            transaction.product = product

            res.status(200).send({ transaction })
        } catch (error) {
            res.status(500).send({ message: error })
        }

    },
    cancelOrderById: async (req, res) => {
        try {
            const { idTransaction } = req.params;
            const getTransaction = `SELECT * FROM product 
            INNER JOIN product_transaction ON product.idproduct = product_transaction.idproduct
            INNER JOIN transaction ON product_transaction.idtransaction = transaction.idtransaction
            WHERE transaction.idtransaction = ${idTransaction};`;

            // await query(getTransaction);

            const cancelQuery = `DELETE FROM product_transaction WHERE idtransaction = ${idTransaction};`;

            // await query(cancelQuery);
            return res.status(200).send({ message: "Cancel order is success" });
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    },
    setStatus: async (req, res) => {
        const idTransaction = parseInt(req.params.idTransaction)
        const { status } = req.body
        await query(`UPDATE transaction SET status = ${db.escape(status)} WHERE idtransaction = ${db.escape(idTransaction)}`)
        res.status(200).send({ message: 'Delivery Confirmed' })
    },
    fetchTransactionInfo: async (req, res) => {
        const idUser = parseInt(req.params.idUser)
        const transactionQUery = await query(`SELECT * FROM transaction WHERE iduser =${db.escape(idUser)}`)
        res.status(200).send(transactionQUery)
    }
}