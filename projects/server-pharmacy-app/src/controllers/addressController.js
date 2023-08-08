const { db, query } = require("../database");

module.exports = {
  ProvinceList: async (req, res) => {
    try {
      const provincesQuery = await query("SELECT * FROM province");
      res.status(200).send(provincesQuery);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  addUserAddress: async (req, res) => {
    try {
      let {
        idUser,
        idCity,
        idProvince,
        street,
        isPrimary,
        district,
        postal_code,
        cityName,
        type,
      } = req.body;
      idUser = parseInt(idUser);
      idCity = parseInt(idCity);
      idProvince = parseInt(idProvince);
      postal_code = parseInt(postal_code);
      if (isPrimary) {
        await query(`UPDATE address SET isprimary = false WHERE isprimary = true`);
      }
      const addressQuery = await query(
        `INSERT INTO address VALUES(null,${db.escape(idUser)},${db.escape(
          idCity
        )},${db.escape(idProvince)},${db.escape(street)},${db.escape(
          isPrimary
        )},${db.escape(district)},${db.escape(postal_code)},${db.escape(
          cityName
        )},${db.escape(type)})`
      );
      res.status(200).send({ message: "Address Created" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  primaryUserAddres: async (req, res) => {
    try {
      const idUser = parseInt(req.params.userId);
      const primaryAddress = await query(`
        SELECT address.*, province.province, user.full_name,user.phone_number
        FROM address
        INNER JOIN province ON address.idprovince = province.province_id
        INNER JOIN user ON address.iduser = user.iduser
        WHERE address.iduser = ${db.escape(idUser)} AND address.isprimary = true;
      `);
      res.status(200).send(primaryAddress);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  userAddres: async (req, res) => {
    try {
      const idUser = req.params.userId;
      const offset = parseInt(req.query.offset) ? parseInt(req.query.offset) : 0;
  
      const allAddress = await query(`
        SELECT address.*, province.province, user.*
        FROM address
        INNER JOIN province ON address.idprovince = province.province_id
        INNER JOIN user ON address.iduser = user.iduser
        WHERE address.iduser = ${db.escape(idUser)}
        ORDER BY address.isprimary DESC
        LIMIT 2 OFFSET ${db.escape(offset)};
      `);
      const countData = await query(`
        SELECT COUNT(*) as count FROM address WHERE iduser = ${db.escape(idUser)}
      `);
      res.status(200).send({ allAddress, countData });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  removeAddress: async (req, res) => {
    try {
      const idAddress = parseInt(req.params.idAddress);
      await query(`DELETE FROM address WHERE idaddress = ${db.escape(idAddress)}`);
      res.status(200).send({ message: "Delete Success" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  
  setPrimary: async (req, res) => {
    try {
      const idAddress = parseInt(req.params.idAddress);
      await query(`UPDATE address SET isprimary = false WHERE isprimary = true`);
      await query(
        `UPDATE address SET isprimary = true WHERE idaddress = ${db.escape(
          idAddress
        )}`
      );
      res.status(200).send({ message: "New Primary Address Has Been Set" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
    addAddress: async (req, res) => {
    try {
      const {
        userId,
        firstName,
        lastName,
        idprovince,
        idcity,
        phoneNumber,
        labelAddress,
        city_name,
        postalCode,
        userAddress,
        primary,
        province,
      } = req.body;

      if (primary) {
        await query(
          `UPDATE address SET isprimary = false WHERE isprimary = true`
        );
      }

      //below is to check whether we have the province in province table database
      const isProvinceExistQuery = `select * from province where province_id = ${db.escape(
        idprovince
      )}`;
      const isProvinceExist = await query(isProvinceExistQuery);

      // Add new province to province database if not available
      if (isProvinceExist.length === 0) {
        const addNewProvinceQuery = `insert into province values (${db.escape(
          idprovince
        )}, ${db.escape(province)});`;
        await query(addNewProvinceQuery);
      }

      let newAddressQuery = `insert into address values (null, ${db.escape(
        userId
      )}, ${db.escape(idcity)}, ${db.escape(idprovince)}, ${db.escape(
        userAddress
      )}, ${db.escape(primary)}, null, ${db.escape(postalCode)}, ${db.escape(
        city_name
      )}, ${db.escape(labelAddress)});`;

      const newAddress = await query(newAddressQuery);
      if (newAddress.affectedRows === 0) {
        return res
          .status(200)
          .send({ success: true, message: "Fail to Add New Address" });
      }

      return res
        .status(200)
        .send({ success: true, message: "Success Adding New Address!" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
