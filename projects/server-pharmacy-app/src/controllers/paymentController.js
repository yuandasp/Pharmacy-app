const { db, query } = require("../database");
const { format } = require("date-fns");

module.exports = {
  uploadPayment: async (req, res) => {
    try {
      const idtransaction = parseInt(req.params.idtransaction);
      const filename = "/" + req.file.filename;

      if (filename === "") {
        return res
          .status(200)
          .send({ success: false, message: "Please Upload Your Payment!" });
      }

      const uploadPaymentQuery = `UPDATE transaction SET payment_image = ${db.escape(
        filename
      )}, review_date = ${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )} , status = "UNDER REVIEW" where idtransaction = ${db.escape(
        idtransaction
      )};`;
      const uploadPayment = await query(uploadPaymentQuery);
      if (uploadPayment.affectedRows === 1) {
        return res
          .status(200)
          .send({ success: true, message: "Your Payment Uploaded!" });
      } else {
        return res.status(200).send({
          success: false,
          messaage: "Fail to Upload",
        });
      }
    } catch (error) {
      return res.send(400).status(error);
    }
  },
};
