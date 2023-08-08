const { db, query } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password, phone_number } = req.body;

      const getUsersQuery = `SELECT * FROM user WHERE email=${db.escape(
        email
      )};`;
      const getUsers = await query(getUsersQuery);

      if (getUsers.length > 0 && getUsers[0].email === email) {
        return res.status(400).send({ message: "Email has been used" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const addUserQuery = `INSERT INTO user VALUES(null, ${db.escape(
        username
      )}, null, null, null, ${db.escape(email)} ,${phone_number}, ${db.escape(
        hashPassword
      )}, 0, null, null);`;

      const addUser = await query(addUserQuery);

      const payload = { id: addUser.insertId };
      const token = jwt.sign(payload, process.env.JWT_KEY);

      const insertTokenQuery = `UPDATE user SET token=${db.escape(
        token
      )} WHERE iduser=${db.escape(addUser.insertId)}`;

      await query(insertTokenQuery);

      let mail = {
        from: `Admin <${process.env.NODEMAILER_USER}>`,
        to: `${email}`,
        subject: `Please verified your account!`,
        html: `
        <div>
        <p>Thanks for register, you need to activate your account,</p>
        <a href="${process.env.LINK_VERIFICATION}${token}">Click here</a>
        <span>to activate</span>
        </div>`,
      };

      await nodemailer.sendMail(mail);

      return res.status(200).send({
        data: addUser,
        message: "Success register! Please verify your email",
      });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  verification: async (req, res) => {
    try {
      const iduser = req.user.id;

      const isUserExistQuery = `SELECT * FROM user WHERE iduser=${iduser};`;
      const isUserExist = await query(isUserExistQuery);

      if (isUserExist.length === 0) {
        return res.status(400).send({ message: "User tidak ditemukan" });
      }

      const verificationUserQuery = `UPDATE user SET is_verified=true WHERE iduser=${iduser};`;
      const verificationUser = await query(verificationUserQuery);
      res.status(200).send({ success: true, message: "Account is verified" });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserExistQuery = `SELECT * FROM user WHERE email=${db.escape(
        email
      )};`;
      const isUserExist = await query(isUserExistQuery);

      if (isUserExist[0].is_verified === 0) {
        return res
          .status(400)
          .send({ message: "Please verified your account!" });
      }

      if (isUserExist.length === 0) {
        return res
          .status(400)
          .send({ message: "Email or password is invalid" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isUserExist[0].password
      );

      if (!isPasswordValid) {
        return res
          .status(400)
          .send({ message: "Email or password is invalid" });
      }

      let payload = {
        id: isUserExist[0].iduser,
        type: "user",
      };

      const token = jwt.sign(payload, process.env.JWT_KEY);

      return res.status(200).send({
        message: "login success!",
        token,
        data: {
          iduser: isUserExist[0].iduser,
          username: isUserExist[0].username,
          profile_image: isUserExist[0].profile_image,
          phone_number: isUserExist[0].phone_number,
          full_name: isUserExist[0].full_name,
          gender: isUserExist[0].gender,
          birthdate: isUserExist[0].birthdate,
        },
      });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const idUser = req.user.id;

      const isUserExistQuery = `SELECT * FROM user WHERE iduser=${idUser};`;
      const isUserExist = await query(isUserExistQuery);

      if (isUserExist.length === 0) {
        return res.status(400).send({ message: "User not found" });
      }

      if (password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          isUserExist[0].password
        );

        if (!isPasswordValid) {
          return res
            .status(400)
            .send({ message: "Current password is invalid" });
        }
      }

      const isNewPasswordSame = await bcrypt.compare(
        newPassword,
        isUserExist[0].password
      );

      if (isNewPasswordSame) {
        return res.status(400).send({
          message: "New password must not same with previous password",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      const changePasswordQuery = `UPDATE user SET password=${db.escape(
        hashPassword
      )} WHERE iduser=${idUser};`;
      const changePassword = await query(changePasswordQuery);

      return res.status(200).send({ message: "Please login again" });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  sendLinkResetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const getUserQuery = `SELECT * FROM user WHERE email=${db.escape(
        email
      )};`;
      const getUser = await query(getUserQuery);

      if (getUser.length === 0) {
        return res.status(400).send({
          message: "Email is invalid",
        });
      }

      const payload = { id: getUser[0].iduser };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1m",
      });

      let mail = {
        from: `Admin <yuanhar123@gmail.com>`,
        to: `${email}`,
        subject: `Reset password!`,
        html: `
        <div>
        <p>Click link below to reset your password</p>
        <a href="${process.env.LINK_RESET_PASSWORD}${token}">Reset Password</a>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);
      return res
        .status(200)
        .send({ message: "Link reset password has been sent!" });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const isAdminExistQuery = `SELECT * FROM admin WHERE email=${db.escape(
        email
      )};`;
      const isAdminExist = await query(isAdminExistQuery);

      if (isAdminExist.length === 0) {
        return res.status(400).send({ message: "User admin is not found" });
      }

      if (password !== isAdminExist[0].password) {
        return res.status(400).send({ message: "User admin is not found" });
      }

      let payload = {
        id: isAdminExist[0].idadmin,
        type: "admin",
      };

      const token = jwt.sign(payload, process.env.JWT_KEY);

      return res.status(200).send({
        message: "login success!",
        token,
        data: {
          idadmin: isAdminExist[0].idadmin,
          email: isAdminExist[0].email,
          profile_image: isAdminExist[0].profile_image,
          fullname: isAdminExist[0].fullname,
        },
      });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
};
