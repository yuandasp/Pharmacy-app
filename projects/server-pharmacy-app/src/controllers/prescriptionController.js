const { db, query } = require("../database");
const { format } = require("date-fns");
const nodemailer = require("../helpers/nodemailer");

module.exports = {
  uploadPrescription: async (req, res) => {
    try {
      const iduser = parseInt(req.params.iduser);
      const filename = "/" + req.file.filename;
      const status = "ON QUEUE";
      const uploadPrescriptionQuery = `INSERT INTO prescription (idprescription, idadmin, iduser, prescription_image, status, date, price, idaddress, weight, doctor, patient)
      VALUES (null, null, ${db.escape(iduser)}, ${db.escape(
        filename
      )}, ${db.escape(status)}, ${db.escape(
        format(Date.now(), "yyyy-MM-dd HH:mm:ss")
      )},null,null,null,null,null)`;
      const uploadPrescription = await query(uploadPrescriptionQuery);
      if (uploadPrescription.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "Prescription Submitted!" });
      } else {
        return res
          .status(200)
          .send({ success: false, message: "No Data Recorded" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  fetchPrescription: async (req, res) => {
    try {
      const presId = parseInt(req.params.presId);
      const prescriptionQuery = await query(
        `SELECT * FROM prescription WHERE idprescription = ${db.escape(presId)}`
      );
      res.status(200).send(prescriptionQuery);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  convertUnitPrescription: async (req, res) => {
    try {
      const idProd = parseInt(req.params.idProd);
      const {
        retail_quantity,
        quantity,
        stock,
        unit,
        unit_retail,
        productQuantity,
      } = req.body;
      const date = new Date();
      const dateTime =
        date.getFullYear() +
        "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("00" + date.getDate()).slice(-2);
      await query(
        `UPDATE product SET stock = ${db.escape(
          stock
        )} , retail_remain = ${db.escape(
          retail_quantity
        )} WHERE idproduct = ${db.escape(idProd)}`
      );
      await query(
        `INSERT INTO restock VALUES (null,${db.escape(idProd)},${db.escape(
          unit
        )},${db.escape(dateTime)},${db.escape(
          quantity
        )},'Unit Conversion','Pengurangan')`
      );
      await query(
        `INSERT INTO restock VALUES (null,${db.escape(idProd)},${db.escape(
          unit_retail
        )},${db.escape(dateTime)},${db.escape(
          productQuantity
        )},'Unit Conversion','Penambahan')`
      );
      res.status(200).send({ message: "Conversion Success" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  preparePrescription: async (req, res) => {
    try {
      const { medicines, totalprice, weight, doctor, patient } = req.body;
      const medicine = medicines[0];
      const date = new Date();
      const dateTime =
        date.getFullYear() +
        "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);
      medicines.map(async (medicine) => {
        await query(
          `INSERT INTO products_prescription VALUES (null,${db.escape(
            medicine.idproduct
          )},${db.escape(medicine.idprescription)},${db.escape(
            medicine.unit
          )},${db.escape(medicine.status)})`
        );
      });
      await query(
        `UPDATE prescription SET idadmin = ${db.escape(
          medicine.idadmin
        )}, status='WAITING TO CHECKOUT', date= ${db.escape(
          dateTime
        )}, price =${db.escape(totalprice)},weight=${db.escape(
          weight
        )},doctor=${db.escape(doctor)},patient=${db.escape(
          patient
        )} WHERE idprescription = ${db.escape(medicine.idprescription)}`
      );
      res
        .status(200)
        .send({ message: "Prescription has been sent to the user" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  prescriptionOrder: async (req, res) => {
    try {
      const iduser = parseInt(req.params.iduser);
      const {
        orderProduct,
        orderAddress,
        orderPrice,
        courierData,
        serviceData,
      } = req.body;
      const setTransactionOrderQuery = await query(
        `INSERT INTO transaction values (null, ${db.escape(
          orderProduct.idprescription
        )}, null, ${db.escape(iduser)}, null, ${db.escape(
          orderAddress.idaddress
        )} ,${db.escape(
          format(new Date(), "yyyy-MM-dd HH:mm:ss")
        )},null, null, null, null, null, "WAITING FOR PAYMENT", ${db.escape(
          orderPrice
        )}, null, ${db.escape(courierData)}, ${db.escape(
          serviceData.service
        )}, ${db.escape(serviceData.description)}, ${db.escape(
          serviceData.cost[0].value
        )} );`
      );
      await query(
        `UPDATE prescription SET status = 'DONE' WHERE idprescription = ${db.escape(
          orderProduct.idprescription
        )}`
      );
      res
        .status(200)
        .send({ message: "Order has been created. Please make a payment" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  rejectPrescription: async (req, res) => {
    try {
      const idPrescription = parseInt(req.params.idPrescription);
      await query(
        `UPDATE prescription SET status = 'REJECTED' WHERE idprescription = ${db.escape(
          idPrescription
        )}`
      );
      res.status(200).send({ message: "Prescription has been canceled" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
