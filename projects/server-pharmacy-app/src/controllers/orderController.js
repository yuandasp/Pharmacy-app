const { db, query } = require("../database");
const { format } = require("date-fns");
const nodemailer = require("../helpers/nodemailer");

module.exports = {
  uploadOrder: async (req, res) => {
    try {
      const iduser = parseInt(req.params.iduser);
      const {
        orderProduct,
        orderAddress,
        orderPrice,
        courierData,
        serviceData,
        idpromo,
        bonusItems,
      } = req.body;

      const status = "WAITING FOR PAYMENT";

      const setTransactionOrderQuery = `insert into transaction values (null, null, null, ${db.escape(
        iduser
      )}, ${db.escape(idpromo)}, ${db.escape(
        orderAddress.idaddress
      )} ,${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )},null, null, null, null, null, ${db.escape(status)}, ${db.escape(
        orderPrice
      )}, null, ${db.escape(courierData)}, ${db.escape(
        serviceData.service
      )}, ${db.escape(serviceData.description)}, ${db.escape(
        serviceData.cost[0].value
      )} );`;

      const setTransactionOrder = await query(setTransactionOrderQuery);
      const { insertId } = setTransactionOrder;

      // Create an array to store the promises
      const productPromises = orderProduct.map(async (product) => {
        let setProductTransactionQuery = `insert into product_transaction values (null, ${db.escape(
          product.idproduct
        )}, ${db.escape(insertId)}, ${db.escape(product.quantity)})`;
        await query(setProductTransactionQuery);
      });
      if (bonusItems) {
        const bonusPromises = bonusItems.map(async (item) => {
          await query(
            `INSERT INTO bonus_products VALUES (null,${db.escape(
              insertId
            )},${db.escape(item.id)},${db.escape(item.quantity)})`
          );
        });
        await Promise.all(bonusPromises);
      }

      // Wait for all the promises to resolve
      await Promise.all(productPromises);

      return res.status(200).send({
        success: true,
        message: "Your order has been recorded!",
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getWaitingOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const waitingForPayment = "WAITING FOR PAYMENT";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where iduser=${db.escape(
        iduser
      )} and status=${db.escape(waitingForPayment)},
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.waiting_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.waiting_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchWaitingOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where transaction.iduser = ${iduser} and status=${db.escape(
        waitingForPayment
      )}
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.waiting_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.waiting_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.waiting_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const fetchWaitingOrder = await query(fetchWaitingOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchWaitingOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchWaitingOrder.map(async (order, index) => {
        const fetchWaitingProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchWaitingProduct = await query(fetchWaitingProductQuery);
        return { ...order, orderProduct: fetchWaitingProduct };
      });
      const waitingOrder = await Promise.all(oldTemp);

      return res
        .status(200)
        .send({ success: true, waitingOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllWaitingOrder: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const waitingForPayment = "WAITING FOR PAYMENT";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where status=${db.escape(
        waitingForPayment
      )}
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.waiting_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.waiting_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchAllWaitingOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where status=${db.escape(
        waitingForPayment
      )} 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.waiting_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.waiting_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.waiting_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const fetchAllWaitingOrder = await query(fetchAllWaitingOrderQuery);

      // if fetchWaitingOrder length is 0, we return the result
      if (fetchAllWaitingOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchAllWaitingOrder.map(async (order, index) => {
        const fetchAllWaitingProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchAllWaitingProduct = await query(fetchAllWaitingProductQuery);

        return { ...order, orderProduct: fetchAllWaitingProduct };
      });
      const allWaitingOrder = await Promise.all(oldTemp);

      return res.status(200).send({
        success: true,
        allWaitingOrder,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getFinishedOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const complete = "COMPLETE";
      const canceled = "CANCELED";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where iduser=${db.escape(
        iduser
      )} and (status=${db.escape(complete)} or status=${db.escape(
        canceled
      )}) and transaction.finished_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.finished_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.finished_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchFinishedOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where transaction.iduser = ${iduser} and (status=${db.escape(
        complete
      )} or status=${db.escape(
        canceled
      )}) and transaction.finished_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.finished_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.finished_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.finished_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const fetchFinishedOrder = await query(fetchFinishedOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchFinishedOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchFinishedOrder.map(async (order, index) => {
        const fetchFinishedProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchFinishedProduct = await query(fetchFinishedProductQuery);
        return { ...order, orderProduct: fetchFinishedProduct };
      });
      const finishedOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, finishedOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllFinishedOrder: async (req, res) => {
    try {
      const idadmin = req.params.idadmin;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.sort || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const complete = "COMPLETE";
      const canceled = "CANCELED";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where (status=${db.escape(
        complete
      )} or status=${db.escape(
        canceled
      )}) and transaction.finished_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.finished_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.finished_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchFinishedOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where (status=${db.escape(
        complete
      )} or status=${db.escape(
        canceled
      )}) and transaction.finished_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.finished_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.finished_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.finished_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchFinishedOrder = await query(fetchFinishedOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchFinishedOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchFinishedOrder.map(async (order, index) => {
        const fetchFinishedProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchFinishedProduct = await query(fetchFinishedProductQuery);
        return { ...order, orderProduct: fetchFinishedProduct };
      });
      const finishedOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, finishedOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getSendOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onTheWay = "ON THE WAY";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where iduser=${db.escape(
        iduser
      )} and status=${db.escape(
        onTheWay
      )} and transaction.send_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.send_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.send_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchSendOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where transaction.iduser = ${iduser} and status=${db.escape(
        onTheWay
      )} and transaction.send_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.send_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.send_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.onprocess_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchSendOrder = await query(fetchSendOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchSendOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchSendOrder.map(async (order, index) => {
        const fetchSendProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchSendProduct = await query(fetchSendProductQuery);
        return { ...order, orderProduct: fetchSendProduct };
      });
      const sendOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, sendOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllSendOrder: async (req, res) => {
    try {
      const idadmin = req.params.idadmin;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.sort || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onTheWay = "ON THE WAY";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where status=${db.escape(
        onTheWay
      )} and transaction.send_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.send_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.send_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchSendOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where status=${db.escape(
        onTheWay
      )} and transaction.send_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.send_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.send_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.onprocess_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchSendOrder = await query(fetchSendOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchSendOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchSendOrder.map(async (order, index) => {
        const fetchSendProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchSendProduct = await query(fetchSendProductQuery);
        return { ...order, orderProduct: fetchSendProduct };
      });
      const sendOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, sendOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getOnProcessOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onProcess = "ON PROCESS";
      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where iduser=${db.escape(
        iduser
      )} and status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.onprocess_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.onprocess_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchOnProcessOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where transaction.iduser = ${iduser} and status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.onprocess_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.onprocess_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.onprocess_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchOnProcessOrder = await query(fetchOnProcessOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchOnProcessOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchOnProcessOrder.map(async (order, index) => {
        const fetchOnProcessProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchOnProcessProduct = await query(fetchOnProcessProductQuery);
        return { ...order, orderProduct: fetchOnProcessProduct };
      });
      const onProcessOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, onProcessOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllOnProcessOrder: async (req, res) => {
    try {
      const idadmin = req.params.idadmin;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.sort || "asc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onProcess = "ON PROCESS";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.onprocess_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.onprocess_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchOnProcessOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.onprocess_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.onprocess_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and transaction.idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.onprocess_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchOnProcessOrder = await query(fetchOnProcessOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchOnProcessOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchOnProcessOrder.map(async (order, index) => {
        const fetchOnProcessProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchOnProcessProduct = await query(fetchOnProcessProductQuery);
        return { ...order, orderProduct: fetchOnProcessProduct };
      });
      const onProcessOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, onProcessOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getReviewOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const underReview = "UNDER REVIEW";
      const paymentConfirmed = "PAYMENT CONFIRMED";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where iduser=${db.escape(
        iduser
      )} and (status=${db.escape(underReview)} or status=${db.escape(
        paymentConfirmed
      )}) and transaction.review_date is not null and transaction.payment_image is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.review_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.review_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchReviewOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where transaction.iduser = ${iduser} and (status=${db.escape(
        underReview
      )} or status=${db.escape(
        paymentConfirmed
      )}) and transaction.review_date is not null and transaction.payment_image is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.review_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.review_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.review_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchReviewOrder = await query(fetchReviewOrderQuery);

      //if fetchWaitingOrder length is 0, we return the result
      if (fetchReviewOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchReviewOrder.map(async (order, index) => {
        const fetchWaitingProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity,product.idproduct, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchWaitingProduct = await query(fetchWaitingProductQuery);

        return { ...order, orderProduct: fetchWaitingProduct };
      });
      const reviewOrder = await Promise.all(oldTemp);
      return res
        .status(200)
        .send({ success: true, reviewOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllReviewOrder: async (req, res) => {
    try {
      const idadmin = req.params.idadmin;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 3);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const underReview = "UNDER REVIEW";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where status=${db.escape(
        underReview
      )} and transaction.review_date is not null and transaction.payment_image is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.review_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.review_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;
      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      //first thing we do is simply fetch the transaction where iduser matching and payment_image = null, limit by 3 offset 0
      const fetchReviewOrderQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
      transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date,
      transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code
      from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where status=${db.escape(
        underReview
      )} and transaction.review_date is not null and transaction.payment_image is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and transaction.review_date >= ${db.escape(
          startDate + " 00:00:00"
        )} and transaction.review_date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idtransaction like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by transaction.review_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchReviewOrder = await query(fetchReviewOrderQuery);
      //if fetchReviewOrder length is 0, we return the result

      if (fetchReviewOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      const oldTemp = fetchReviewOrder.map(async (order, index) => {
        const fetchWaitingProductQuery = `
        SELECT transaction.idtransaction, transaction.iduser, transaction.idpromo, transaction.waiting_date, transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, product_transaction.quantity,product.idproduct, product.name, product.price, product.description, product.product_image, product.unit_product, promo.discount, promo.type, promo.description AS promo_description,prescription.doctor,prescription.patient,prescription.prescription_image,prescription.price as prescription_price
        FROM transaction
        LEFT JOIN product_transaction ON transaction.idtransaction = product_transaction.idtransaction
        LEFT JOIN product ON product_transaction.idproduct = product.idproduct
        LEFT JOIN promo ON product.idpromo = promo.idpromo
        LEFT JOIN prescription ON transaction.idprescription = prescription.idprescription
        WHERE transaction.idtransaction = ${order.idtransaction};
      `;
        const fetchWaitingProduct = await query(fetchWaitingProductQuery);

        return { ...order, orderProduct: fetchWaitingProduct };
      });
      const reviewOrder = await Promise.all(oldTemp);

      return res
        .status(200)
        .send({ success: true, reviewOrder, totalOfRows, totalPages, page });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getPrescriptionOrder: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 10);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onQueue = "ON QUEUE";
      const waitingToCheckout = "WAITING TO CHECKOUT";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idprescription) as totalOfRows from prescription where iduser=${db.escape(
        iduser
      )} and (status=${db.escape(onQueue)} OR status=${db.escape(
        waitingToCheckout
      )}) and prescription.date is not null and prescription.prescription_image is not null 
      ${
        !startDate && !endDate
          ? ``
          : `
        and prescription.date >= ${db.escape(
          startDate + " 00:00:00"
        )} and prescription.date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idprescription like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      const fetchTransactionOrderQuery = `select * from prescription where iduser = ${iduser} and (status=${db.escape(
        onQueue
      )} OR status=${db.escape(
        waitingToCheckout
      )}) and prescription.date is not null and prescription.prescription_image is not null
      ${
        !startDate && !endDate
          ? ``
          : `
        and prescription.date >= ${db.escape(
          startDate + " 00:00:00"
        )} and prescription.date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idprescription like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by prescription.date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const fetchTransactionOrder = await query(fetchTransactionOrderQuery);

      // if fetchWaitingOrder length is 0, we return the result
      if (fetchTransactionOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      return res.status(200).send({
        success: true,
        fetchTransactionOrder,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  getAllPrescriptionOrder: async (req, res) => {
    try {
      const idadmin = req.params.idadmin;
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 10);
      const search = req.query.search || "";
      const ascDescend = req.query.order || "desc";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onQueue = "ON QUEUE";
      const waitingToCheckout = "WAITING TO CHECKOUT";

      //querying total rows of data transaction from sql
      const totalRowsQuery = `select count(idprescription) as totalOfRows from prescription where (status=${db.escape(
        onQueue
      )} OR status=${db.escape(
        waitingToCheckout
      )}) and prescription.date is not null and prescription.prescription_image is not null
      ${
        !startDate && !endDate
          ? ``
          : `
        and prescription.date >= ${db.escape(
          startDate + " 00:00:00"
        )} and prescription.date <= ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idprescription like ${
        search || "" ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      const fetchPrescriptionOrderQuery = `select prescription.idprescription, prescription.idadmin, prescription.iduser, user.username, user.full_name,user.email, prescription.prescription_image,
      prescription.status, prescription.date from prescription inner join user on prescription.iduser = user.iduser where (status=${db.escape(
        onQueue
      )} OR status=${db.escape(
        waitingToCheckout
      )}) and prescription.date is not null and prescription.prescription_image is not null
      ${
        !startDate && !endDate
          ? ``
          : `
        and prescription.date >=  ${db.escape(
          startDate + " 00:00:00"
        )} and prescription.date < ${db.escape(endDate + " 23:59:59")}
        `
      }
      and idprescription like ${
        search ? `${db.escape(`%${search}%`)}` : `${db.escape("%%")}`
      } order by prescription.date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const fetchPrescriptionOrder = await query(fetchPrescriptionOrderQuery);

      // if fetchWaitingOrder length is 0, we return the result
      if (fetchPrescriptionOrder.length === 0) {
        return res.status(200).send({
          success: false,
          message: "You don't have any waiting order!",
        });
      }

      return res.status(200).send({
        success: true,
        fetchPrescriptionOrder,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  acceptPayment: async (req, res) => {
    try {
      const idAdmin = req.params.idadmin;
      const { idtransaction } = req.body;
      const paymentConfirmed = "PAYMENT CONFIRMED";
      const acceptIdTransactionQuery = `update transaction set status=${db.escape(
        paymentConfirmed
      )}, idadmin=${db.escape(idAdmin)} where idtransaction = ${idtransaction}`;
      const acceptIdTransaction = await query(acceptIdTransactionQuery);

      if (acceptIdTransaction.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "We are processing your order" });
      } else {
        return res.status(200).send({
          success: false,
          message: "Fail to update your order, we don't know why",
        });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  confirmPayment: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const { idtransaction, orderProduct } = req.body;
      const onProcess = "ON PROCESS";
      const acceptIdTransactionQuery = `update transaction set status=${db.escape(
        onProcess
      )}, onprocess_date = ${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )} where idtransaction = ${idtransaction}`;

      await orderProduct.map(async (product) => {
        const updateProductQuery = `update product set stock = stock - ${db.escape(
          product.quantity
        )} where idproduct = ${product.idproduct}`;

        await query(updateProductQuery);

        const updateRestockReportQuery = `insert into restock values (null, ${db.escape(
          product.idproduct
        )},null, ${db.escape(format(new Date(), "yyyy-MM-dd"))}, ${db.escape(
          product.quantity
        )}, 'penjualan', 'pengurangan')`;

        await query(updateRestockReportQuery);
      });

      const acceptIdTransaction = await query(acceptIdTransactionQuery);
      if (acceptIdTransaction.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "We are processing your order" });
      } else {
        return res.status(200).send({
          success: false,
          message: "Fail to update your order, we don't know why",
        });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  rejectPayment: async (req, res) => {
    try {
      const idAdmin = req.params.idadmin;
      const { idtransaction } = req.body;
      const waitingForPayment = "WAITING FOR PAYMENT";
      const rejectIdTransactionQuery = `update transaction set status=${db.escape(
        waitingForPayment
      )}, cancel_date=${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )}, idadmin=${db.escape(
        idAdmin
      )}, payment_image=null where idtransaction = ${idtransaction}`;
      const rejectIdTransaction = await query(rejectIdTransactionQuery);

      if (rejectIdTransaction.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "We are processing your order" });
      } else {
        return res.status(200).send({
          success: false,
          message: "Fail to update your order, we don't know why",
        });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  submitPayment: async (req, res) => {
    try {
      const idAdmin = req.params.idadmin;
      const { idtransaction } = req.body;
      const onTheWay = "ON THE WAY";
      const submitIdTransactionQuery = `update transaction set status=${db.escape(
        onTheWay
      )}, send_date=${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )}, idadmin=${db.escape(idAdmin)} where idtransaction = ${idtransaction}`;
      const submitIdTransaction = await query(submitIdTransactionQuery);
      if (submitIdTransaction.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "Your order is on the way" });
      } else {
        return res.status(200).send({
          success: false,
          message: "Fail to update your order, we don't know why",
        });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  completePayment: async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const { idtransaction } = req.body;
      const complete = "COMPLETE";
      const completeIdTransactionQuery = `update transaction set status=${db.escape(
        complete
      )}, finished_date=${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )} where idtransaction = ${idtransaction}`;
      const completeIdTransaction = await query(completeIdTransactionQuery);

      if (completeIdTransaction.affectedRows !== 0) {
        return res
          .status(200)
          .send({ success: true, message: "Thank you for purchasing" });
      } else {
        return res.status(200).send({
          success: false,
          message: "Fail to update your order, we don't know why",
        });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  adminCancelOrder: async (req, res) => {
    const idAdmin = parseInt(req.params.idadmin);
    const { idTransaction, email } = req.body;
    const canceled = "CANCELED";
    await query(
      `update transaction set status=${db.escape(
        canceled
      )}, finished_date=${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )} , idadmin=${db.escape(idAdmin)} where idtransaction = ${idTransaction}`
    );
    let mail = {
      from: `Admin <${process.env.NODEMAILER_USER}>`,
      to: `${email}`,
      subject: `Notification Of rejection`,
      html: `
      <div>
      <p>Sorry,Your Transaction with Transaction ID ${idTransaction} Has Been Canceled By Admin, You Still can See Details on Finished Transaction. For Refund Please Contact Customer Service</p>
      </div>`,
    };

    await nodemailer.sendMail(mail);
    res.status(200).send({ message: "Transaction Has Been canceled" });
  },

  userCancelOrder: async (req, res) => {
    const iduser = parseInt(req.params.iduser);
    const { idTransaction, email } = req.body;
    const canceled = "CANCELED";
    await query(
      `update transaction set status=${db.escape(
        canceled
      )}, finished_date=${db.escape(
        format(new Date(), "yyyy-MM-dd HH:mm:ss")
      )} where idtransaction = ${idTransaction}`
    );
    let mail = {
      from: `Admin <${process.env.NODEMAILER_USER}>`,
      to: `${email}`,
      subject: `Notification Of rejection`,
      html: `
      <div>
      <p>Your Transaction with Transaction ID ${idTransaction} is Cancelled, You Still can See Details on Finished Transaction. For Refund Please Contact Customer Service</p>
      </div>`,
    };

    await nodemailer.sendMail(mail);
    res.status(200).send({ message: "Transaction Has Been canceled" });
  },

  // getWaitingProduct: async (req, res) => {
  //   const idtransaction = req.params.idtransaction;
  //   const fetchWaitingProductQuery = `select transaction.idtransaction, transaction.iduser, transaction.date, transaction.time, transaction.status, transaction.total, product_transaction.quantity, product.name, product.price, product.description, product.product_image, category.name from transaction inner join product_transaction on transaction.idtransaction = product_transaction.idtransaction inner join product on product_transaction.idproduct = product.idproduct inner join category on product.idcategory = product.idcategory where transaction.idtransaction = ${29} order by date asc limit 3 offset 0;`;

  //   const fetchWaitingProduct = await query(fetchWaitingProductQuery);

  //   console.log(fetchWaitingProduct);
  //   res.status(200).send({ product: fetchWaitingProduct });
  // },
};
