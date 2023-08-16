const { db, query } = require("../database");

module.exports = {
  getSalesTransactionReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 10);
      const ascDescend = req.query.order || "desc";
      const search = req.query.search || "";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);

      const totalRowsQuery = `select count(idtransaction) as totalOfRows from transaction where transaction.onprocess_date is not null ${
        !startDate && !endDate
          ? ``
          : `
          and transaction.onprocess_date >= ${db.escape(
            startDate + " 00:00:00"
          )} and transaction.onprocess_date <= ${db.escape(
              endDate + " 23:59:59"
            )}
          `
      };`;

      const totalRows = await query(totalRowsQuery);
      const { totalOfRows } = totalRows[0];
      const totalPages = Math.ceil(totalOfRows / limit);

      const getSalesTransactionQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
        transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where onprocess_date is not null 
        ${
          !startDate && !endDate
            ? ``
            : `
              and transaction.onprocess_date >= ${db.escape(
                startDate + " 00:00:00"
              )} and transaction.onprocess_date <= ${db.escape(
                endDate + " 23:59:59"
              )}
              `
        }
        and idtransaction like '%%' order by transaction.onprocess_date ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;
      const getSalesTransaction = await query(getSalesTransactionQuery);
      if (getSalesTransaction.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "No data retrieved" });
      }

      return res.status(200).send({
        success: true,
        message: "Data successfully retrieved",
        report: getSalesTransaction,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getAllSalesTransaction: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 20);
      const ascDescend = req.query.order || "desc";
      const search = req.query.search || "";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);

      const getSalesTransactionQuery = `select  transaction.idtransaction, transaction.idprescription, transaction.idadmin, transaction.iduser, transaction.idpromo, transaction.idaddress, transaction.waiting_date,
        transaction.review_date, transaction.onprocess_date, transaction.send_date, transaction.finished_date, transaction.cancel_date, transaction.status, transaction.total, transaction.payment_image,transaction.courier, transaction.service, transaction.description, transaction.freightCost, address.street, province.province, address.city_name, address.address_type, user.username, user.full_name, user.phone_number, user.email, address.postal_code from transaction inner join address on transaction.idaddress = address.idaddress inner join user on transaction.iduser = user.iduser inner join province on address.idprovince = province.province_id where onprocess_date is not null 
        ${
          !startDate && !endDate
            ? ``
            : `
              and transaction.onprocess_date >= ${db.escape(
                startDate + " 00:00:00"
              )} and transaction.onprocess_date <= ${db.escape(
                endDate + " 23:59:59"
              )}
              `
        }
        and idtransaction like '%%' order by transaction.onprocess_date ${ascDescend};`;
      const getSalesTransaction = await query(getSalesTransactionQuery);
      if (getSalesTransaction.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "No data retrieved" });
      }

      return res.status(200).send({
        success: true,
        message: "Data successfully retrieved",
        report: getSalesTransaction,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getUserTransactionReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 5);
      const ascDescend = req.query.order || "desc";
      const search = req.query.search || "";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onProcess = "ON PROCESS";

      const totalRowsQuery = `select distinct transaction.iduser from transaction where transaction.onprocess_date is not null ${
        !startDate && !endDate
          ? ``
          : `
          and transaction.onprocess_date >= ${db.escape(
            startDate + " 00:00:00"
          )} and transaction.onprocess_date <= ${db.escape(
              endDate + " 23:59:59"
            )}
          `
      };`;

      const totalRows = await query(totalRowsQuery);
      const totalOfRows = totalRows.length;
      const totalPages = Math.ceil(totalOfRows / limit);

      const getUserTransactionQuery = `select sum(total) as TotalPrice, transaction.iduser, user.full_name, user.username from transaction inner join user on transaction.iduser = user.iduser inner join address on transaction.idaddress = address.idaddress where transaction.status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null
        ${
          !startDate && !endDate
            ? ``
            : `
              and transaction.onprocess_date >= ${db.escape(
                startDate + " 00:00:00"
              )} and transaction.onprocess_date <= ${db.escape(
                endDate + " 23:59:59"
              )}
              `
        }
        group by transaction.iduser order by sum(transaction.total) ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const getUserTransaction = await query(getUserTransactionQuery);
      if (getUserTransaction.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "No data retrieved" });
      }

      return res.status(200).send({
        success: true,
        message: "Data successfully retrieved",
        report: getUserTransaction,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getAllUserTransactionReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 20);
      const ascDescend = req.query.order || "desc";
      const search = req.query.search || "";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);
      const onProcess = "ON PROCESS";

      const getUserTransactionQuery = `select sum(total) as TotalPrice, transaction.iduser, user.full_name, user.username from transaction inner join user on transaction.iduser = user.iduser inner join address on transaction.idaddress = address.idaddress where transaction.status=${db.escape(
        onProcess
      )} and transaction.onprocess_date is not null
      ${
        !startDate && !endDate
          ? ``
          : `
            and transaction.onprocess_date >= ${db.escape(
              startDate + " 00:00:00"
            )} and transaction.onprocess_date <= ${db.escape(
              endDate + " 23:59:59"
            )}
            `
      }
      group by transaction.iduser order by sum(transaction.total) ${ascDescend};`;
      const getUserTransaction = await query(getUserTransactionQuery);
      if (getUserTransaction.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "No data retrieved" });
      }

      return res.status(200).send({
        success: true,
        message: "Data successfully retrieved",
        report: getUserTransaction,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getProductTransactionReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page || 0);
      const limit = parseInt(req.query.limit || 10);
      const ascDescend = req.query.order || "desc";
      const search = req.query.search || "";
      const offset = limit * page;
      const { startDate, endDate } = JSON.parse(req.query.date);

      const totalRowsQuery = `select product.idproduct from product_transaction inner join transaction on product_transaction.idtransaction = transaction.idtransaction inner join product on product.idproduct = product_transaction.idproduct 
      ${
        !startDate && !endDate
          ? ``
          : `
              where transaction.onprocess_date >= ${db.escape(
                startDate + " 00:00:00"
              )} and transaction.onprocess_date <= ${db.escape(
              endDate + " 23:59:59"
            )}
            `
      } 
      group by product.idproduct order by sum(transaction.total) ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const totalRows = await query(totalRowsQuery);
      const totalOfRows = totalRows.length;
      const totalPages = Math.ceil(totalOfRows / limit);

      const productTransactionQuery = `select product.idproduct, product.name, product.price, product.stock, sum(product_transaction.quantity) as quantity, sum(transaction.total) as purchase
      from product_transaction inner join transaction on product_transaction.idtransaction = transaction.idtransaction inner join product on product.idproduct = product_transaction.idproduct
      ${
        !startDate && !endDate
          ? ``
          : `
              where transaction.onprocess_date >= ${db.escape(
                startDate + " 00:00:00"
              )} and transaction.onprocess_date <= ${db.escape(
              endDate + " 23:59:59"
            )}
            `
      }
      group by product.idproduct order by sum(transaction.total) ${ascDescend} limit ${db.escape(
        limit
      )} offset ${db.escape(offset)};`;

      const productTransaction = await query(productTransactionQuery);

      if (productTransaction.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "No data retrieved" });
      }

      return res.status(200).send({
        success: true,
        message: "Data successfully retrieved",
        report: productTransaction,
        totalOfRows,
        totalPages,
        page,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getAllProductTransactionReport: async (req, res) => {
    const page = parseInt(req.query.page || 0);

    const ascDescend = req.query.order || "desc";
    const search = req.query.search || "";
    const { startDate, endDate } = JSON.parse(req.query.date);

    const productTransactionQuery = `select product.idproduct, product.name, product.price, product.stock, sum(product_transaction.quantity) as quantity, sum(transaction.total) as purchase
    from product_transaction inner join transaction on product_transaction.idtransaction = transaction.idtransaction inner join product on product.idproduct = product_transaction.idproduct
    ${
      !startDate && !endDate
        ? ``
        : `
            where transaction.onprocess_date >= ${db.escape(
              startDate + " 00:00:00"
            )} and transaction.onprocess_date <= ${db.escape(
            endDate + " 23:59:59"
          )}
          `
    }
    group by product.idproduct order by sum(transaction.total);`;
    const productTransaction = await query(productTransactionQuery);

    if (productTransaction.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "No data retrieved" });
    }

    return res.status(200).send({
      success: true,
      message: "Data successfully retrieved",
      report: productTransaction,
    });
  },
};
