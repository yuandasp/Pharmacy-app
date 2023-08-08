const { db, query } = require("../database");

module.exports = {
  fetchUser: async (req, res) => {
    try {
      const user_id = parseInt(req.params.id);
      const userQuery = await query(
        `SELECT * FROM user WHERE iduser=${db.escape(user_id)}`
      );
      const user = {
        username: userQuery[0].username,
        email: userQuery[0].email,
        phone_number: userQuery[0].phone_number,
        fullname: userQuery[0].full_name,
        gender: userQuery[0].gender,
        profile_image: userQuery[0].profile_image,
        birthdate: userQuery[0].birthdate,
      };
      res.status(200).send(user);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  uploadPicture: async (req, res) => {
    try {
      const user_id = parseInt(req.params.id);
      const filename = "/" + req.file.filename;
      await query(
        `UPDATE user SET profile_image = ${db.escape(
          filename
        )} WHERE iduser =${db.escape(user_id)}`
      );
      res.status(200).send({ message: "Upload Success" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  editProfiles: async (req, res) => {
    try {
      const user_id = parseInt(req.params.id);
      const { username, fullname, gender, birthdate, email } = req.body;
      const date = new Date(birthdate);
      const dateTime =
        date.getFullYear() +
        "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("00" + date.getDate()).slice(-2);
  
      await query(
        `UPDATE user SET 
        username = ${db.escape(username)},
        full_name = ${db.escape(fullname)},
        gender = ${db.escape(gender)},
        birthdate = ${db.escape(dateTime)},
        email = ${db.escape(email)}
        WHERE iduser = ${db.escape(user_id)}`
      );
      
      res.status(200).send({ message: "Update Success" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
}