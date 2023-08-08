const { query, db } = require("../database");
const deleteFile = require("../helpers/deleteFile");

module.exports = {
  getLatestProduct: async (req, res) => {
    try {
      const getLatestProductQuery = `SELECT * FROM product ORDER BY idproduct DESC LIMIT 10;`;
      const latestProduct = await query(getLatestProductQuery);

      return res.status(200).send(latestProduct);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  getAllProductsByFilter: (req, res) => {
    let filterQuery = `SELECT product.*,promo.discount,promo.description as promo_description,promo.type FROM product LEFT JOIN promo ON promo.idpromo = product.idpromo`;
    const { order, productName, category, sortBy, page } = req.query;

    const limit = 10;
    const pageNumber = !isNaN(Number(page)) ? Number(page) : 1;
    const offset = limit * pageNumber - limit;

    if (productName) {
      filterQuery = `SELECT product.* FROM product WHERE name LIKE ${db.escape(
        productName + "%"
      )}`;
    }

    if (category) {
      filterQuery = `SELECT product.*, category.name as 'category.name',category.idcategory as 'category.idcategory' FROM product INNER JOIN category on product.idcategory = category.idcategory WHERE category.name = ${db.escape(
        category
      )}`;
    }

    const ordering = order && order.toLowerCase() === "desc" ? "desc" : "asc";

    if (sortBy === "name" || sortBy === "price" || sortBy === "idproduct") {
      filterQuery = `${filterQuery} ORDER BY product.${sortBy} ${ordering}`;
    }

    let totalPage = 0;
    db.query(filterQuery, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      totalPage = Math.ceil(results.length / limit);
    });

    filterQuery = `${filterQuery} LIMIT ${offset}, ${limit}`;

    db.query(filterQuery, (err, results) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).send({ products: results, totalPage });
    });
  },
  adminProduct: async (req, res) => {
    const order = req.query.order;
    const filter = req.query.filter;
    const search = req.query.search;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);
    const limitClause =
      limit > 0 ? `LIMIT ${db.escape(limit)} OFFSET ${db.escape(offset)}` : "";
    const queryCondition =
      filter === "converted"
        ? "WHERE product.idunit IS NOT NULL "
        : filter === "not converted"
        ? "WHERE product.idunit IS NULL "
        : "";
    const productQuery = await query(`SELECT *
    FROM product
    LEFT JOIN unit ON product.idunit = unit.idunit
    ${queryCondition} ${
      search && queryCondition
        ? `AND (product.name LIKE ${db.escape(`%${search}%`)})`
        : search
        ? `WHERE (product.name LIKE ${db.escape(`%${search}%`)})`
        : ""
    }
    ORDER BY product.name ${order}
    ${limitClause}`);
    const categoryQuery =
      await query(`SELECT products_categories.*,category.name as category_name
    FROM products_categories
    INNER JOIN category ON products_categories.idcategory = category.idcategory
    `);
    const countData = await query(`SELECT COUNT (*) as count
    FROM product
    LEFT JOIN unit ON product.idunit = unit.idunit
    ${queryCondition} ${
      search && queryCondition
        ? `AND (product.name LIKE ${db.escape(`%${search}%`)})`
        : search
        ? `WHERE (product.name LIKE ${db.escape(`%${search}%`)})`
        : ""
    }`);
    res.status(200).send({ productQuery, categoryQuery, countData });
  },
  updateStock: async (req, res) => {
    const idProduct = parseInt(req.params.idProduct);
    let { stock, updatedStock, unit } = req.body;
    const status = updatedStock > 0 ? "Penambahan" : "Pengurangan";
    updatedStock = Math.abs(updatedStock);
    const date = new Date();
    const dateTime =
      date.getFullYear() +
      "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + date.getDate()).slice(-2);
    stock = parseInt(stock);

    await query(
      `UPDATE product SET stock = ${db.escape(
        stock
      )} WHERE idproduct =${db.escape(idProduct)}`
    );
    await query(
      `INSERT INTO restock VALUES(null,${db.escape(idProduct)},${db.escape(
        unit
      )},${db.escape(dateTime)},${db.escape(
        updatedStock
      )},'Update Stock',${db.escape(status)})`
    );
    res.status(200).send({ message: "Update stock succes" });
  },
  getAllProductOnAdminDashboard: async (req, res) => {
    try {
      const idCategory = req.query.idcategory;
      const search = req.query.search;
      const sort = req.query.sort;
      const key = req.query.key;
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;

      let getAllProductQuery = `SELECT * FROM product`;

      if (search) {
        getAllProductQuery += ` WHERE name LIKE '%${search}%'`;
      }

      if (idCategory !== undefined) {
        getAllProductQuery = `SELECT p.*, c.name as category_name, c.idcategory as category_id FROM product p
        LEFT JOIN products_categories pc ON p.idproduct = pc.idproduct
        LEFT JOIN category c ON pc.idcategory = c.idcategory
        WHERE c.idcategory=${idCategory}`;

        if (search) {
          getAllProductQuery += ` AND p.name LIKE '%${search}%'`;
        }
      }

      if (sort) {
        getAllProductQuery += ` ORDER BY ${key} ${sort}`;
      }

      getAllProductQuery += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

      const getAllProduct = await query(getAllProductQuery);

      const result = getAllProduct.map(async (product) => {
        const productCategories = await query(
          `select * from products_categories
          left join category on category.idcategory = products_categories.idcategory
          where idproduct=${product.idproduct};`
        );

        return { ...product, categories: productCategories };
      });

      const results2 = await Promise.all(result);

      let getCountQuery = `SELECT Count(*) as count FROM product`;

      if (search) {
        getCountQuery += ` WHERE name LIKE '%${search}%'`;
      }

      if (idCategory !== undefined) {
        getCountQuery = `SELECT Count(*) as count FROM (select pc.*, c.name as category_name from products_categories pc
        left join category c on c.idcategory = pc.idcategory
        WHERE c.idcategory=${idCategory}) y;`;
      }

      const countData = await query(getCountQuery);

      res.status(200).send({ products: results2, count: countData[0].count });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  getDetailProductOnAdminDashboard: async (req, res) => {
    try {
      const idParams = req.params.idproduct;

      let getAllProductQuery = `SELECT * FROM product WHERE idproduct=${idParams}`;
      const getAllProduct = await query(getAllProductQuery);

      const result = getAllProduct.map(async (product) => {
        const productCategories = await query(
          `select * from products_categories
          left join category on category.idcategory = products_categories.idcategory
          where idproduct=${product.idproduct};`
        );

        return { ...product, categories: productCategories };
      });

      const results2 = await Promise.all(result);
      return res.status(200).send({ product: results2[0] });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  UnitConversionRules: async (req, res) => {
    const { unit, quantity, unitDefault } = req.body;
    const unitQuery = await query(
      `SELECT * FROM unit WHERE unitname = ${db.escape(
        unit
      )} AND quantity = ${db.escape(quantity)}`
    );
    if (unitQuery.length > 0) {
      res.status(200).send({ message: "Unit Conversion Rules Has Been Set" });
    } else {
      await query(
        `INSERT INTO unit VALUES(null,${db.escape(unitDefault)},${db.escape(
          unit
        )},${db.escape(quantity)})`
      );
      res.status(200).send({ message: "Unit Conversion Rules Has Been Set" });
    }
  },
  convertedUnit: async (req, res) => {
    const convertedQuery =
      await query(`SELECT product.*,unit.unitname,unit.quantity as conversion_quantity FROM product
    INNER JOIN unit ON product.idunit = unit.idunit`);
    res.status(200).send(convertedQuery);
  },
  setConversionRules: async (req, res) => {
    const idProduct = parseInt(req.params.idProduct);
    const { idUnit } = req.body;
    await query(
      `UPDATE product SET idunit = ${db.escape(
        idUnit
      )} WHERE idproduct= ${db.escape(idProduct)}`
    );
    res.status(200).send({ message: "Rules has been set to this product" });
  },
  fetchRules: async (req, res) => {
    let rulesQuery = await query(`SELECT * FROM unit`);
    res.status(200).send(rulesQuery);
  },
  changeDefaultUnit: async (req, res) => {
    const idProduct = parseInt(req.params.idProduct);
    const { unit_product, stock } = req.body;
    await query(
      `UPDATE product SET unit_product = ${db.escape(
        unit_product
      )} , stock = ${db.escape(stock)} WHERE idproduct = ${db.escape(
        idProduct
      )}`
    );
    res.status(200).send({ message: "Change Succes" });
  },
  removeRule: async (req, res) => {
    const idProduct = parseInt(req.params.idProduct);
    await query(
      `UPDATE product SET idunit = null WHERE idproduct= ${db.escape(
        idProduct
      )}`
    );
    res.status(200).send({ message: "Rule has been Removed" });
  },

  getProductById: async (req, res) => {
    try {
      const { idProduct } = req.params;

      let getAllProductQuery = `SELECT * FROM product WHERE idproduct=${idProduct}`;
      const getAllProduct = await query(getAllProductQuery);

      const result = getAllProduct.map(async (product) => {
        const productCategories = await query(
          `select * from products_categories
          left join category on category.idcategory = products_categories.idcategory
          where idproduct=${product.idproduct};`
        );

        return { ...product, categories: productCategories };
      });

      const results2 = await Promise.all(result);
      return res.status(200).send({ product: results2[0] });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },

  // Admin
  createProduct: async (req, res) => {
    const filename = req.file?.filename;

    try {
      const {
        idcategoryOne,
        idcategoryTwo,
        idcategoryThree,
        name,
        price,
        description,
        stock,
        unitProduct,
        weight,
      } = req.body;

      if (!name) {
        return res.status(500).send({ message: "Product name is required!" });
      }

      const createProductQuery = `INSERT INTO product (name, price, description, stock, product_image, unit_product, weight) VALUES (${db.escape(
        name
      )},${db.escape(price)},${db.escape(description)},${db.escape(
        stock
      )}, ${db.escape(filename)}, ${db.escape(unitProduct)}, ${db.escape(
        weight
      )});`;

      const createProduct = await query(createProductQuery);
      const idProduct = createProduct.insertId;

      if (
        idcategoryOne &&
        idcategoryOne !== "undefined" &&
        idcategoryOne !== "null"
      ) {
        const addCategoryProductQueryOne = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryOne});`;
        const addCategoryProduct = await query(addCategoryProductQueryOne);
      }

      if (
        idcategoryTwo &&
        idcategoryTwo !== "undefined" &&
        idcategoryTwo !== "null"
      ) {
        const addCategoryProductQueryTwo = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryTwo});`;
        const addCategoryProduct = await query(addCategoryProductQueryTwo);
      }

      if (
        idcategoryThree &&
        idcategoryThree !== "undefined" &&
        idcategoryThree !== "null"
      ) {
        const addCategoryProductQueryThree = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryThree});`;
        const addCategoryProduct = await query(addCategoryProductQueryThree);
      }

      return res.status(200).send({ message: "succes add product" });
    } catch (error) {
      deleteFile(filename);
      return res.status(500).send({ message: error });
    }
  },
  updateProduct: async (req, res) => {
    const filename = req.file?.filename;

    try {
      const {
        idcategoryOne,
        idcategoryTwo,
        idcategoryThree,
        idpromo,
        name,
        price,
        description,
        unitProduct,
        weight,
      } = req.body;
      const { idProduct } = req.params;

      const getProductsCategoriesQuery = `DELETE FROM products_categories WHERE idproduct=${idProduct};`;
      const getProductsCategories = await query(getProductsCategoriesQuery);

      let updateQuery = "UPDATE product SET ";

      if (name) {
        updateQuery += `name = ${db.escape(name)},`;
      }
      if (price) {
        updateQuery += `price = ${db.escape(price)},`;
      }
      if (description) {
        updateQuery += `description = ${db.escape(description)},`;
      }
      if (filename) {
        updateQuery += `product_image = ${db.escape(filename)},`;
      }
      if (idpromo) {
        updateQuery += `idpromo = ${idpromo},`;
      }
      if (unitProduct) {
        updateQuery += `unit_product = ${db.escape(unitProduct)},`;
      }
      if (weight) {
        updateQuery += `weight = ${db.escape(weight)},`;
      }
      if (
        idcategoryOne &&
        idcategoryOne !== "undefined" &&
        idcategoryOne !== "null"
      ) {
        const addCategoryProductQueryOne = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryOne});`;
        const addCategoryProduct = await query(addCategoryProductQueryOne);
      }

      if (
        idcategoryTwo &&
        idcategoryTwo !== "undefined" &&
        idcategoryTwo !== "null"
      ) {
        const addCategoryProductQueryTwo = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryTwo});`;
        const addCategoryProduct = await query(addCategoryProductQueryTwo);
      }

      if (
        idcategoryThree &&
        idcategoryThree !== "undefined" &&
        idcategoryThree !== "null"
      ) {
        const addCategoryProductQueryThree = `INSERT INTO products_categories VALUES (null ,${idProduct}, ${idcategoryThree});`;
        const addCategoryProduct = await query(addCategoryProductQueryThree);
      }

      updateQuery =
        updateQuery.slice(0, updateQuery.length - 1) +
        ` WHERE idproduct = ${idProduct};`;

      await query(updateQuery);
      return res.status(200).send({ message: "Edit Success" });
    } catch (error) {
      if (filename) {
        deleteFile(filename);
      }
      return res.status(500).send({ message: error });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { idProduct } = req.params;

      const getProductQuery = `SELECT * FROM product p
      LEFT JOIN products_categories pc on pc.idproduct = p.idproduct
      WHERE p.idproduct=${idProduct};`;
      const getProduct = await query(getProductQuery);

      if (getProduct[0].id_products_categories) {
        const result = getProduct.map(async (product) => {
          const deleteProductCategoriesQuery = `DELETE FROM products_categories WHERE id_products_categories=${product.id_products_categories};`;
          await query(deleteProductCategoriesQuery);
        });
      }

      const deleteQuery = `DELETE FROM product WHERE idproduct = ${idProduct};`;
      await query(deleteQuery);

      return res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      return res.status(200).send({ message: error });
    }
  },
  getAllUnitConversion: async (req, res) => {
    try {
      const getAllUnitConversionQuery = await query(`SELECT * FROM unit;`);

      return res.status(200).send(getAllUnitConversionQuery);
    } catch (error) {
      return res.status(200).send({ message: error });
    }
  },
  getAllPromo: async (req, res) => {
    try {
      const getAllPromo = await query(`SELECT * FROM promo;`);

      return res.status(200).send(getAllPromo);
    } catch (error) {
      return res.status(200).send({ message: error });
    }
  },
  getAllHistoryProductStock: async (req, res) => {
    try {
      const startDate = req.query.start;
      const endDate = req.query.end;
      const sort = req.query.sort;
      const key = req.query.key;
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;

      let getHistoryProductStockQuery = `SELECT restock.*, product.name AS name, product.product_image AS image, product.idproduct FROM restock
      LEFT JOIN product ON product.idproduct = restock.idproduct`;

      if (sort) {
        getHistoryProductStockQuery += ` ORDER BY ${key} ${sort}`;
      }

      if (startDate && endDate) {
        getHistoryProductStockQuery += ` WHERE date BETWEEN ${db.escape(
          startDate
        )} AND ${db.escape(endDate)}`;
      }

      getHistoryProductStockQuery += ` LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;

      const getHistoryProductStock = await query(getHistoryProductStockQuery);

      let getCountQuery = `SELECT Count(*) as count FROM restock;`;

      if (startDate !== undefined && endDate !== undefined) {
        getCountQuery = `SELECT Count(*) as count FROM (SELECT * FROM restock
        WHERE date BETWEEN ${db.escape(startDate)} AND ${db.escape(
          endDate
        )}) y;`;
      }

      const count = await query(getCountQuery);

      return res.status(200).send({ history: getHistoryProductStock, count });
    } catch (error) {
      return res.status(200).send({ message: error });
    }
  },
  getHistoryProductStockByIdproduct: async (req, res) => {
    try {
      const idproduct = req.query.idproduct;
      const startDate = req.query.start;
      const endDate = req.query.end;
      const sort = req.query.sort;
      const key = req.query.key;
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;

      let getHistoryProductStockQuery = `SELECT restock.*, product.name AS name, product.product_image AS image FROM restock
      LEFT JOIN product ON product.idproduct = restock.idproduct WHERE restock.idproduct=${idproduct}`;

      if (startDate && endDate) {
        getHistoryProductStockQuery += ` AND date BETWEEN ${db.escape(
          startDate
        )} AND ${db.escape(endDate)}`;
      }

      if (sort) {
        getHistoryProductStockQuery += ` ORDER BY ${key} ${sort}`;
      }

      getHistoryProductStockQuery += ` LIMIT ${limit} OFFSET ${
        (page - 1) * limit
      }`;

      const getHistoryProductStock = await query(getHistoryProductStockQuery);

      let getCountQuery = `SELECT Count(*) as count FROM restock WHERE idproduct=${idproduct};`;

      if (startDate !== undefined && endDate !== undefined) {
        getCountQuery = `SELECT Count(*) as count FROM (SELECT * FROM restock
        WHERE date BETWEEN ${db.escape(startDate)} AND ${db.escape(
          endDate
        )}) y WHERE idproduct=${idproduct};`;
      }

      const count = await query(getCountQuery);

      return res.status(200).send({ history: getHistoryProductStock, count });
    } catch (error) {
      return res.status(200).send({ message: error });
    }
  },
};
