const { db, query } = require("../../database/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../../helpers/nodemailer");

module.exports = {
  fetchAllUserQuestion: async (req, res) => {
    try {
      const is_answer = req.query.is_answer;
      const sort = req.query.sort;
      const key = req.query.key;
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const search = req.query.search;

      let getAllUserQuestionQuery = `SELECT question.*, answer.idanswer, answer.idadmin, answer.answer, question.date FROM question
      LEFT JOIN answer ON answer.idquestion = question.idquestion`;

      let getCountQuery = `SELECT COUNT(*) as count FROM question`;

      if (search) {
        getAllUserQuestionQuery += ` WHERE question LIKE '%${search}%'`;
        getCountQuery += ` WHERE question LIKE '%${search}%'`;
      }

      if (is_answer !== undefined) {
        getCountQuery = `SELECT COUNT(*) as count FROM question WHERE is_answer=${is_answer}`;
        getAllUserQuestionQuery = `SELECT question.*, answer.idanswer, answer.idadmin, answer.answer, question.date FROM question
             LEFT JOIN answer ON answer.idquestion = question.idquestion WHERE is_answer=${is_answer}`;

        if (search) {
          getAllProductQuery += ` AND question.question LIKE '%${search}%'`;
          getCountQuery += ` AND question.question LIKE '%${search}%'`;
        }
      }

      if (sort) {
        getAllUserQuestionQuery += ` ORDER BY ${key} ${sort}`;
      }

      const countData = await query(getCountQuery);

      getAllUserQuestionQuery += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

      const getAllUserQuestion = await query(getAllUserQuestionQuery);

      res
        .status(200)
        .send({ questions: getAllUserQuestion, count: countData[0].count });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  fetchDetailUserQuestion: async (req, res) => {
    try {
      const idParams = req.params.idquestion;

      const getDetailUserQuestionQuery = `SELECT question.*, answer.idanswer, answer.idadmin, answer.answer, question.date FROM question
      LEFT JOIN answer ON answer.idquestion = question.idquestion WHERE question.idquestion=${idParams};`;
      const getDetailUserQuestion = await query(getDetailUserQuestionQuery);

      res.status(200).send(getDetailUserQuestion);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  addAnswerToUserQuestion: async (req, res) => {
    try {
      const idquestion = req.params.idquestion;
      const idadmin = req.user.id;
      const { answer } = req.body;
      const timestamp = Math.floor(new Date().getTime() / 1000);
      var time = new Date(timestamp * 1000);

      const getUserQuestionQuery = `SELECT * FROM question WHERE idquestion=${idquestion};`;
      const getUserQuestion = await query(getUserQuestionQuery);

      if (getUserQuestion[0].is_answer === 1) {
        return res.status(400).send({
          message:
            "Question has been answered! You no longer answer this question.",
        });
      }

      const addAnswerQuery = `INSERT INTO answer VALUES (null, ${idadmin}, ${idquestion}, ${db.escape(
        answer
      )}, ${db.escape(time)});`;
      const addAnswer = await query(addAnswerQuery);

      const updateIsAnswerQuery = `UPDATE question SET is_answer=true WHERE idquestion=${idquestion};`;
      const updateIsAnswer = await query(updateIsAnswerQuery);

      const getDetailUserQuestionQuery = `SELECT question.*, answer.idanswer, answer.idadmin, answer.answer, answer.date FROM question
      JOIN answer ON answer.idquestion = question.idquestion WHERE question.idquestion=${idquestion};`;
      const getDetailUserQuestion = await query(getDetailUserQuestionQuery);

      const getEmailUserQuery = `SELECT user.iduser, user.email FROM question
      JOIN user ON user.iduser = question.iduser WHERE question.idquestion=${idquestion};`;
      const getEmailUser = await query(getEmailUserQuery);

      const email = getEmailUser[0].email;
      let mail = {
        from: `Admin <${process.env.NODEMAILER_USER}>`,
        to: `${email}`,
        subject: `You got reply!`,
        html: `
        <div>
        <p>Pharmacy Web has answered your question.</p>
        <a href="${process.env.LINK_FORUM_USER}">Click here</a>
        <span>to see your question</span>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);

      res.status(200).send({
        data: getDetailUserQuestion,
        message: "Your answer has been sent!",
      });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
  deleteUserQuestion: async (req, res) => {
    try {
      const idquestion = req.params.idquestion;

      const getAllUserQuestionQuery = `SELECT question.*, answer.idanswer, answer.idadmin, answer.answer, answer.date FROM question
      LEFT JOIN answer ON answer.idquestion = question.idquestion;`;
      const getAllUserQuestion = await query(getAllUserQuestionQuery);

      const deleteUserAnswerQuery = `DELETE FROM answer WHERE idanswer=${getAllUserQuestion[0].idanswer};`;
      const deleteUserQuestionQuery = `DELETE FROM question WHERE idquestion=${idquestion};`;

      if (getAllUserQuestion.length > 0) {
        const deleteUserQuestion = await query(deleteUserAnswerQuery);
      }

      const deleteUserQuestion = await query(deleteUserQuestionQuery);
      res.status(200).send(getAllUserQuestion);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },
};
